import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingSpinner({ message = 'Carregando dados...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, width: '100%' }}>
      <CircularProgress size={48} thickness={5} sx={{ color: '#22336b', mb: 2 }} />
      <Typography variant="subtitle1" sx={{ color: '#22336b', fontWeight: 500 }}>{message}</Typography>
    </Box>
  );
}

export default LoadingSpinner;
