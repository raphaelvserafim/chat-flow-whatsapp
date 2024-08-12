import React from 'react';
import { Box, Typography, } from '@mui/material';
export function TabLabel({ icon, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{label}</Typography>
    </Box>
  )
}