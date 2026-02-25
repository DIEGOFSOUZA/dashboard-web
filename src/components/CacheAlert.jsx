/**
 * Componente de alerta para notificar sobre cache obsoleto
 */

import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCacheContext } from '../context/CacheContext';

function CacheAlert() {
  const {
    showCacheAlert,
    setShowCacheAlert,
    hasStaleCache,
    verifyCacheStatus
  } = useCacheContext();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowCacheAlert(false);
  };

  const handleRefresh = async () => {
    await verifyCacheStatus();
    setShowCacheAlert(false);
  };

  if (!hasStaleCache && !showCacheAlert) {
    return null;
  }

  return (
    <Snackbar
      open={showCacheAlert || hasStaleCache}
      autoHideDuration={8000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity="warning"
        variant="filled"
        action={
          <button
            onClick={handleRefresh}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              marginLeft: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshIcon fontSize="small" />
            Atualizar
          </button>
        }
      >
        <AlertTitle>⚠️ Cache Obsoleto</AlertTitle>
        Os dados em cache podem estar desatualizados. Clique em "Atualizar" para recarregar.
      </Alert>
    </Snackbar>
  );
}

export default CacheAlert;
