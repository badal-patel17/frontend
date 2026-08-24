import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  useReactFlow
} from '@xyflow/react';

import '@xyflow/react/dist/base.css';

import './flow-chart.scss'
import { PlayCircleFilled, PlayCircleOutline } from '@mui/icons-material';


const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
  
  const initialNodes = [
    {
      id: '1',
      position: { x: 0, y: 150 },
      data: { label: 'Fallout Engine' },
      ...nodeDefaults,
    },
    // Right side nodes (default)
    {
      id: '2',
      position: { x: 300, y: 50 },
      data: { label: 'Couchbase' },
      ...nodeDefaults,
    },
    {
      id: '3',
      position: { x: 300, y: 150 },
      data: { label: 'Camunda' },
      ...nodeDefaults,
    },
    {
      id: '4',
      position: { x: 300, y: 250 },
      data: { label: 'Kafka' },
      ...nodeDefaults,
    },
    // Left side nodes (override targetPosition)
    {
      id: '5',
      position: { x: -300, y: 50 },
      data: { label: 'Fallout' },
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    },
    {
      id: '6',
      position: { x: -300, y: 150 },
      data: { label: 'Incident' },
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    },
    {
      id: '7',
      position: { x: -300, y: 250 },
      data: { label: 'Cassandra' },
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    },
  ];
  
  

  const initialEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'bezier',
      style: { stroke: '#cd11fb', strokeWidth: 4 },
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'bezier',
      style: { stroke: '#20fbc7', strokeWidth: 4 },
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      type: 'bezier',
      style: { stroke: '#ffe430', strokeWidth: 4 },
    },
    {
        id: 'e1-4',
        source: '1',
        target: '4',
        type: 'bezier',
        style: { stroke: '#ffe430', strokeWidth: 4 },
    },
    {
        id: 'e1-5',
        source: '5',
        target: '1',
        type: 'bezier',
        style: { stroke: '#ffe430', strokeWidth: 4 },
    },
    {
        id: 'e1-6',
        source: '6',
        target: '1',
        type: 'bezier',
        style: { stroke: '#20fbc7', strokeWidth: 4 },
    },
    {
        id: 'e1-7',
        source: '7',
        target: '1',
        type: 'bezier',
        style: { stroke: '#cd11fb', strokeWidth: 4 },
    },
  ];
  

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [],
  );

  return (
    <div className='flow-container'>
        
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      panOnDrag={false}
    zoomOnScroll={false}
    zoomOnPinch={false}
    panOnScroll={false}
    nodesDraggable={false}
    nodesConnectable={false}
      fitView
    >
    <h2 className='gradient-text'><span className='flow-additional'>FLOW</span> DESIGNER</h2>
      <Background color="#949494" gap={10}/>
    </ReactFlow>
    </div>
  );
};

export default FlowChart;
