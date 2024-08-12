import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, addEdge, useEdgesState, useNodesState, Position, Controls, MiniMap } from 'react-flow-renderer';
import { useDrop } from 'react-dnd';

import "../assets/css/flow.css";

import { Sidebar } from './Sidebar';
import { DynamicNode } from './DynamicNode';
import { ItemTypes } from '../constant';
import { CustomEdge } from './CustomEdge';

const nodeTypes = {
  dynamic: DynamicNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(0);

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const handleDeleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);

  const addConnection = useCallback((sourceId) => {
    setNodes((nds) => {
      const newId = (nodeId + 1).toString();
      const newNode = {
        id: newId,
        data: {
          label: `Node ${newId}`,
          type: 'text_message',
          outputs: ['output-0'],
          onDelete: handleDeleteNode,
          onAddConnection: addConnection,
        },
        position: { x: 509, y: 157 },
        type: 'dynamic',
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodeId((prevNodeId) => prevNodeId + 1);
      return [...nds, newNode];
    });

    setEdges((eds) => {
      const newEdge = {
        id: `e${sourceId}-${nodeId + 1}`,
        source: sourceId,
        target: (nodeId + 1).toString(),
        animated: true,
        type: 'custom',
        data: { onEdgeRemove: handleDeleteEdge },
      };
      return [...eds, newEdge];
    });
  }, [setNodes, setEdges, nodeId, handleDeleteNode, handleDeleteEdge]);

  const [{ isOver }, drop] = useDrop({
    accept: Object.values(ItemTypes),
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      const newId = (nodeId + 1).toString();
      const clientOffset = monitor.getClientOffset();
      const { x, y } = clientOffset || { x: 0, y: 0 };

      const newNode = {
        id: newId,
        data: {
          label: `Node ${newId} (${item.type})`,
          type: item.type,
          outputs: ['output-0'],
          onDelete: handleDeleteNode,
          onAddConnection: addConnection,
        },
        position: { x, y },
        type: 'dynamic',
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeId((prevNodeId) => prevNodeId + 1);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div ref={drop} style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom', data: { onEdgeRemove: handleDeleteEdge } }, eds))}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};
