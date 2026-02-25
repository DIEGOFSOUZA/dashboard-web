/**
 * Serviço de API para comunicação com o backend Flask
 * Incluindo verificação de cache e atualização de dados
 */

// Detecta automaticamente a URL da API baseado no ambiente
const getApiBaseUrl = () => {
  // Em desenvolvimento (npm start), sempre usa backend local
  // Evita usar variável de ambiente global apontando para produção
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:5000';
  }

  // Em produção (build), permite override por variável de ambiente
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Em produção (build), usa o mesmo host e porta que serviu o frontend
  // Isso permite acessar de qualquer máquina usando o IP/hostname correto
  if (process.env.NODE_ENV === 'production') {
    // Usa URL relativa - funciona com localhost, IP ou hostname
    return window.location.origin;
  }

  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Verifica o status do cache
 * @returns {Promise<Object>} Status do cache com informações de atualização
 */
export const checkCacheStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar status do cache:', error);
    throw error;
  }
};

/**
 * Verifica se o cache de um produto específico precisa ser atualizado
 * @param {string} cacheKey - Nome da chave de cache (ex: 'sales_evolution')
 * @param {number} maxAgeMinutes - Idade máxima aceitável em minutos (default: 60)
 * @returns {Promise<boolean>} true se o cache está obsoleto
 */
export const isCacheStale = async (cacheKey, maxAgeMinutes = 60) => {
  try {
    const status = await checkCacheStatus();
    
    if (!status.cache_files || !status.cache_files[cacheKey]) {
      return true; // Cache não encontrado é considerado obsoleto
    }
    
    const cacheInfo = status.cache_files[cacheKey];
    
    // Se o arquivo não existe, está obsoleto
    if (!cacheInfo.exists) {
      return true;
    }
    
    // Compara idade do cache com limite estabelecido
    return cacheInfo.age_minutes > maxAgeMinutes;
  } catch (error) {
    console.error(`Erro ao verificar se cache '${cacheKey}' está obsoleto:`, error);
    return true; // Em caso de erro, considera obsoleto para forçar atualização
  }
};

/**
 * Faz uma requisição GET com verificação de cache
 * @param {string} url - URL completa ou caminho relativo
 * @param {Object} options - Opções da fetch (headers, etc)
 * @returns {Promise<Response>}
 */
export const fetchWithCache = async (url, options = {}) => {
  try {
    // Adiciona headers padrão se não existirem
    const finalOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, finalOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

/**
 * Faz uma requisição GET básica
 * @param {string} url - URL da requisição
 * @returns {Promise<Object>} JSON da resposta
 */
export const get = async (url) => {
  const response = await fetchWithCache(url, { method: 'GET' });
  return response.json();
};

/**
 * Faz uma requisição POST básica
 * @param {string} url - URL da requisição
 * @param {Object} data - Dados a enviar
 * @returns {Promise<Object>} JSON da resposta
 */
export const post = async (url, data = {}) => {
  const response = await fetchWithCache(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};

export default {
  checkCacheStatus,
  isCacheStale,
  fetchWithCache,
  get,
  post
};
