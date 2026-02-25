/**
 * Hook customizado para verificação de cache em páginas
 * Verifica o cache ao montar a página e fornece métodos para verificar status
 */

import { useEffect, useState, useCallback } from 'react';
import { useCacheContext } from '../context/CacheContext';

/**
 * Hook que verifica o cache ao entrar em uma página
 * @param {Array<string>} requiredCacheKeys - Array com as chaves de cache necessárias
 * @param {Object} options - Opções adicionais
 * @returns {Object} Objeto com status do cache
 */
export function useCacheVerification(requiredCacheKeys = [], options = {}) {
  const {
    autoRefresh = true,
    maxAgeMinutes = 60,
    onStaleCache = null
  } = options;

  const cacheContext = useCacheContext();
  const [isCacheValid, setIsCacheValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [staleCacheFiles, setStaleCacheFiles] = useState([]);

  // Verifica se os arquivos de cache necessários estão válidos
  const verifyCacheFiles = useCallback(async () => {
    try {
      setIsVerifying(true);

      // Se não há cache a verificar, considera válido
      if (!requiredCacheKeys || requiredCacheKeys.length === 0) {
        setIsCacheValid(true);
        setIsVerifying(false);
        return;
      }

      // Aguarda carregamento inicial do contexto
      if (cacheContext.isLoading) {
        return;
      }

      // Verifica cada arquivo de cache necessário
      const staleFiles = [];
      let allValid = true;

      for (const fileName of requiredCacheKeys) {
        const fileStatus = cacheContext.getCacheFileStatus(fileName);
        
        if (!fileStatus || !fileStatus.exists || fileStatus.is_stale) {
          staleFiles.push({
            fileName,
            status: fileStatus,
            age: fileStatus?.age_minutes || 'N/A'
          });
          allValid = false;
        }
      }

      setStaleCacheFiles(staleFiles);
      setIsCacheValid(allValid);

      // Executa callback se houver cache obsoleto
      if (!allValid && onStaleCache) {
        onStaleCache(staleFiles);
      }

      // Log de cache obsoleto
      if (!allValid) {
        console.log(
          'Cache obsoleto detectado - Auto-atualizando:',
          staleFiles.map(f => `${f.fileName} (${f.age} min)`)
        );
      }
    } catch (error) {
      console.error('Erro ao verificar cache:', error);
      setIsCacheValid(false);
    } finally {
      setIsVerifying(false);
    }
  }, [requiredCacheKeys, cacheContext, onStaleCache]);

  // Verifica cache ao montar o componente
  useEffect(() => {
    verifyCacheFiles();
  }, [verifyCacheFiles]);

  // Verifica cache quando o contexto é atualizado
  useEffect(() => {
    if (!cacheContext.isLoading) {
      verifyCacheFiles();
    }
  }, [cacheContext.lastCheckTime, verifyCacheFiles, cacheContext.isLoading]);

  // Função para forçar re-verificação
  const recheckCache = useCallback(async () => {
    await cacheContext.verifyCacheStatus();
    verifyCacheFiles();
  }, [cacheContext, verifyCacheFiles]);

  return {
    isCacheValid,
    needsRefresh: !isCacheValid && autoRefresh,
    isVerifying: isVerifying || cacheContext.isLoading,
    staleCacheFiles,
    hasStaleCache: cacheContext.hasStaleCache,
    cacheStatus: cacheContext.cacheStatus,
    lastCheckTime: cacheContext.lastCheckTime,
    error: cacheContext.error,
    recheckCache,
    getCacheFileStatus: cacheContext.getCacheFileStatus,
    verifyCacheStatus: cacheContext.verifyCacheStatus
  };
}

export default useCacheVerification;
