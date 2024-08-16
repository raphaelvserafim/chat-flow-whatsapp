import React, { useCallback, useEffect } from 'react';
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
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleNodesChange = useCallback((changes) => {
    if (changes.length > 0) {
      for (const e of changes) {
        if (e.type === "position" && !e?.dragging) {
          const node = nodes.find((node) => node.id === e?.id);
          props.save({ type: e.type, node }).then(({ status, message }) => {
            if (status !== 200) {
              toast.error(message || "ERROR API");
            }
          })
        }
        if (e.type === "remove") {
          props.save({ type: e.type, node: e }).then(({ status, message }) => {
            if (status !== 200) {
              toast.error(message || "ERROR API");
            }
          })
        }
      }
    }

    onNodesChange(changes);
  }, [nodes, onNodesChange, props]);


  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);


  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    
    props.save({ type: "remove", node: { id: nodeId } }).then(({ status, message }) => {
      console.log({ status, message })
      if (status !== 200) {
        toast.error(message || "ERROR API");
      }
    })

  }, [setNodes, setEdges, props]);


  const handleDeleteEdge = useCallback((event) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== event.id));
    props.save({ type: "deleteEdge", source: event.source, target: event.target }).then(({ status, message }) => {
      if (status !== 200) {
        toast.error(message || "ERROR API");
      }
    })
  }, [props, setEdges]);


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
        text_content: data?.text_content || null,
        onDelete: handleDeleteNode,
        onAddConnection: addConnection,
        onEdit: () => props?.onEdit(data.id),
      },
      position: {
        x: data.position_x,
        y: data.position_y,
      },
      type: 'dynamic',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      markerStart: data.type === 'start',
    };
    return node;
  }, [addConnection, handleDeleteNode, props]);


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
          onEdit: () => props?.onEdit(newId),
        },
        position: { x, y },
        type: 'dynamic',
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => [...nds, newNode]);

      props.save({ type: "add", id: newId, item, position: { x, y } }).then(({ status, message }) => {
        if (status !== 200) {
          toast.error(message || "ERROR API");
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

    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      type: 'custom',
      data: { onEdgeRemove: handleDeleteEdge, },
    }, eds));

    props.save({ type: "connect", params }).then(({ status, message }) => {
      if (status !== 200) {
        toast.error(message || "ERROR API");
      }
    });

  }, [nodes, edges, setEdges, props, handleDeleteEdge]);


  useEffect(() => {
    if (props?.nodes && props?.nodes.length > 0) {
      for (const node of props?.nodes) {
        setNodes((nds) => [...nds, processNodeData(node)]);
      }
    }

    if (props?.edges && props?.edges.length > 0) {
      for (const edge of props?.edges) {
        setEdges((eds) => addEdge({
          ...{ source: edge.source, target: edge.target },
          animated: true,
          data: {
            onEdgeRemove: handleDeleteEdge,

          },
          type: 'custom'
        }, eds));
      }
    }

  }, [handleDeleteEdge, processNodeData, props?.edges, props?.nodes, setEdges, setNodes]);

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
