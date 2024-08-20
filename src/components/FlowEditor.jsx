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

function FlowEditorBase(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const generateId = useCallback(() => {
    return `${props?.code}-${generateRandomToken(10)}`;
  }, [props?.code]);

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



  const handleDeleteNode = useCallback((nodeId) => {
    props.save({ type: "remove", node: { id: nodeId } });
  }, [props]);


  const handleDeleteEdge = useCallback((event) => {
    props.save({ type: "deleteEdge", id: event.id, source: event.source, target: event.target });
  }, [props]);


  const addConnection = useCallback((sourceId) => {
    const newId = generateId();
    props.save({ type: "addConnection", id: newId, sourceId });
  }, [generateId, props]);



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
        onEdit: () => props?.onEdit({ id: data.id, type: data.type, }),
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
      props.save({ type: "add", id: newId, item, position: { x, y } });
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

    props.save({ type: "connect", params })

  }, [nodes, edges, props]);


  useEffect(() => {
    if (props?.nodes && props?.nodes.length > 0) {
      const _nodes = props.nodes.map(processNodeData);
      setNodes(_nodes);
    }

    if (props?.edges && props?.edges.length > 0) {
      const _edges = props.edges.map(edge => ({
        ...{ source: edge.source, target: edge.target },
        animated: true,
        data: {
          onEdgeRemove: handleDeleteEdge,
        },
        type: 'custom'
      }));
      setEdges(_edges);
    }
  }, [props.nodes, props.edges, processNodeData, handleDeleteEdge, setNodes, setEdges]);

  return (
    <div ref={drop} style={{ flex: 1 }} key={props?.code}>
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

export const FlowEditor = React.memo(FlowEditorBase);