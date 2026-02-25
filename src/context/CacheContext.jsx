/**
 * Contexto React para gerenciar o estado do cache
 * Fornece informações sobre o status do cache para toda a aplicação
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { checkCacheStatus } from '../services/api';

// Cria o contexto
const CacheContext = createContext(null);

/**
 * Provider do contexto de cache
 * Deve envolver toda a aplicação (em App.js)
 */
export function CacheProvider({ children }) {
  const [cacheStatus, setCacheStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStaleCache, setHasStaleCache] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [error, setError] = useState(null);
  const [showCacheAlert, setShowCacheAlert] = useState(false);

  // Função para verificar o status do cache
  const verifyCacheStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const status = await checkCacheStatus();
      setCacheStatus(status);
      setHasStaleCache(status.has_stale_cache || false);
      setLastCheckTime(new Date());
      
      // Se há cache obsoleto, mostra alerta
      if (status.has_stale_cache) {
        setShowCacheAlert(true);
        // Auto-fecha o alerta após 8 segundos
        setTimeout(() => setShowCacheAlert(false), 8000);
      }
    } catch (err) {
      console.error('Erro ao verificar cache:', err);
      setError(err.message);
      setHasStaleCache(true); // Em caso de erro, assume que está obsoleto
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verifica o cache ao montar o componente
  useEffect(() => {
    verifyCacheStatus();
  }, [verifyCacheStatus]);

  // Verifica o cache a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(verifyCacheStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyCacheStatus]);

  // Função para forçar atualização do status
  const refreshCacheStatus = useCallback(async () => {
    await verifyCacheStatus();
  }, [verifyCacheStatus]);

  const value = {
    cacheStatus,
    isLoading,
    hasStaleCache,
    lastCheckTime,
    error,
    showCacheAlert,
    setShowCacheAlert,
    verifyCacheStatus: refreshCacheStatus,
    getCacheFileStatus: (fileName) => cacheStatus?.cache_files?.[fileName] || null,
    isCacheStale: (fileName) => {
      const file = cacheStatus?.cache_files?.[fileName];
      return !file || file.is_stale;
    }
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}

/**
 * Hook customizado para usar o contexto de cache
 * @returns {Object} Objeto com informações do cache
 */
export function useCacheContext() {
  const context = useContext(CacheContext);
  
  if (!context) {
    throw new Error('useCacheContext deve ser usado dentro de um CacheProvider');
  }
  
  return context;
}

export default CacheContext;
