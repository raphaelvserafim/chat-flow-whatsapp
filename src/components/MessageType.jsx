import React from 'react';
import { useDrag } from 'react-dnd';
import { Box, IconButton, Typography, } from '@mui/material';

export function MessageType({ type, label, Icon }) {
  
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Box
      ref={drag}
      sx={{
        marginTop: 1,
        backgroundColor: isDragging ? '#e0f7fa' : 'transparent',
        border: '1px solid #ddd',
        cursor: 'move',
        padding: 1,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <IconButton
        sx={{
          backgroundColor: 'transparent',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2" sx={{ flex: 1, fontWeight: 'medium' }}>
        {label}
      </Typography>
    </Box>
  );
};