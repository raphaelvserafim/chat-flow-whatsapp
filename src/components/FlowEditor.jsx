import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, addEdge, useEdgesState, useNodesState, Position, Controls, MiniMap } from 'react-flow-renderer';
import { useDrop } from 'react-dnd';

import "@theflow/assets/css/flow.css";

import { DynamicNode, CustomEdge } from '@theflow/components';
import { ItemTypes } from '@theflow/constant';
import { toast } from 'react-toastify';
import { generateRandomToken } from '@theflow/utils';

const nodeTypes = {
  dynamic: DynamicNode,
};

const edgeTypes = {
  custom: CustomEdge,
};



export function FlowEditor(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props?.edges);

  const saveToLocalStorage = useCallback(() => {
    try {
      // localStorage.setItem('nodes', JSON.stringify(nodes));
      // localStorage.setItem('edges', JSON.stringify(edges));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [edges, nodes]);


  const handleNodesChange = useCallback((changes) => {
    if (changes.length > 0) {
      for (const e of changes) {
        if (e.type === "position" && !e?.dragging) {
          const node = nodes.find((node) => node.id === e?.id);
          props.save({ type: e.type, node });
        }
        if (e.type === "remove") {
          props.save({ type: e.type, node: e });
        }
      }
    }

    onNodesChange(changes);
  }, [nodes, onNodesChange, props]);


  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);


  useEffect(() => {
    saveToLocalStorage();
  }, [nodes, edges, saveToLocalStorage]);


  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);


  const handleDeleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);


  const generateId = useCallback(() => {
    return `${props?.code}-${generateRandomToken(10)}`;
  }, [props?.code])


  const addConnection = useCallback((sourceId) => {
    const newId = generateId();
    const newNode = {
      id: newId,
      data: {
        label: 'Node',
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

    setNodes((nds) => [...nds, newNode]);
    // setEdges((eds) => {
    //   const newEdge = {
    //     id: `e${sourceId}-${nextNodeId}`,
    //     source: sourceId,
    //     target: nextNodeId.toString(),
    //     animated: true,
    //     type: 'custom',
    //     data: { onEdgeRemove: handleDeleteEdge },
    //   };
    //   return [...eds, newEdge];
    // });
    // setNextNodeId((prevNodeId) => prevNodeId + 1);
  }, [generateId, handleDeleteNode, setNodes]);




  const processNodeData = useCallback((data) => {
    const node = {
      id: data.id,
      data: {
        label: 'Node',
        type: data.type,
        outputs: ['output-0'],
        onDelete: handleDeleteNode,
        onAddConnection: addConnection,
      },
      position: JSON.parse(data?.position),
      type: 'dynamic',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
    return node;
  }, [addConnection, handleDeleteNode])


  useEffect(() => {
    if (props?.nodes && props?.nodes.length > 0) {
      for (const node of props?.nodes) {
        setNodes((nds) => [...nds, processNodeData(node)]);
      }
    }
  }, [processNodeData, props?.nodes, setNodes]);



  const [{ isOver }, drop] = useDrop({
    accept: Object.values(ItemTypes),
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      const newId = generateId();
      const clientOffset = monitor.getClientOffset();
      const { x, y } = clientOffset || { x: 0, y: 0 };
      const newNode = {
        id: newId,
        data: {
          label: 'Node',
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
      props.save({ type: "add", id: newId, item, position: { x, y } }).then((e) => {
        if (!Boolean(e)) {
          toast.error('Erro na API!');
          handleDeleteNode(newId);
        }
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleConnect = useCallback((params) => {

    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (!sourceNode || !targetNode) {
      return;
    }

    if (sourceNode.data.type === 'menu_message') {
      if (targetNode.data.type !== 'text_message') {
        toast.error('menu_message só pode se conectar a text_message!');
        return;
      }
    }

    const existingEdges = edges.filter(edge => edge.source === params.source);
    if (existingEdges.length > 0 && sourceNode.data.type !== 'menu_message') {
      toast.error('Cada nó pode ter apenas uma conexão de saída, exceto menu_message!');
      return;
    }

    setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom', data: { onEdgeRemove: handleDeleteEdge } }, eds));


    props.save({ type: "connect", params }).then((e) => {
      console.log(e);

    });

  }, [nodes, edges, setEdges, props, handleDeleteEdge]);

  return (
    <div ref={drop} style={{ flex: 1 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
