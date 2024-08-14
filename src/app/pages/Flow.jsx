import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";

// Definir um cookie

import { FlowEditor, Sidebar } from '@theflow/components';
import { Grid } from '@mui/material';
import { FlowService } from '@theflow/services/flow';
export function Flow() {
  Cookies.set("xthex_xflx_xowx", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE3MjM1OTY3NjAsImV4cCI6MTcyNDIwMTU2MH0.jhdTdxHmwLalhRYBVC75HtZFJ1nLMG6Kr7TafTRECHw");

  const { code } = useParams();
  const [savedNodes, setSavedNodes] = useState([]);
  const [savedEdges, setSavedEdges] = useState([]);


  const save = async (data) => {
    console.log({ data });

    if (data?.type === "add") {
      try {
        const response = await FlowService.saveNodes(code, {
          id: data.id,
          type: data.item.type,
          position: {
            x: data.position.x,
            y: data.position.y,
          },
        });
        return response.status === 200;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    if (data?.type === "position") {
      try {
        const response = await FlowService.updateNodes(code, data.node.id, {
          position: {
            x: data.node.position.x,
            y: data.node.position.y,
          },
        });
        return response.status === 200;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    if (data?.type === "remove") {
      try {
        const response = await FlowService.deleteNodes(code, data.node.id);
        return response.status === 200;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    if (data?.type === "connect") {
      try {
        const response = await FlowService.connectEdges(code, data.params);
        return response.status === 200;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    return false;
  };


  React.useEffect(() => {
    if (code) {
      FlowService.fetchGetFlow(code).then(({ status, nodes, edges }) => {
        if (status === 200) {
          if (nodes?.length > 0) {
            setSavedNodes(nodes);
          }
          if (edges?.length > 0) {
            setSavedEdges(edges);
          }
        }
      });
    }
  }, [code]);

  return (
    <Grid style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <FlowEditor
        code={code}
        nodes={savedNodes}
        edges={savedEdges}
        save={save}
      />
    </Grid>
  )

}