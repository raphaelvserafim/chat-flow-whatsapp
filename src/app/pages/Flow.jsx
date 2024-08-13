import React from 'react';
import { useParams } from 'react-router-dom';

import { FlowEditor, Sidebar } from '@theflow/components';
import { Grid } from '@mui/material';
export function Flow() {
  const { code } = useParams();
  console.log({ code });

  const savedNodes = localStorage.getItem('nodes');
  const savedEdges = localStorage.getItem('edges');

  return (
    <Grid style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <FlowEditor
        nodes={savedNodes ? JSON.parse(savedNodes) : []}
        edges={savedEdges ? JSON.parse(savedEdges) : []}
        save={(e) => console.log("save", e)}
      />
    </Grid>
  )

}