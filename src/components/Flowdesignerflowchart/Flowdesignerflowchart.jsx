import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Position
} from '@xyflow/react';
 
// import '@xyflow/react/dist/base.css';
 
import './flowdesignerflowchart.scss'
import { PlayCircleFilled, PlayCircleOutline } from '@mui/icons-material';
import Widget from '../widget/Widget';
 
 
const greenPath = ['5','6','7', '1', '3', '2', '4', '9','8']
 
const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
  
  const initialNodes = [
    {
      id: '1',
      position: { x: -300, y: 150 },
      data: { label: 'Start' },
      ...nodeDefaults,
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'}
    },
    // Right side nodes (default)
    {
      id: '2',
      position: { x: -50, y: 150 },
      data: { label: 'Update fields' },
      ...nodeDefaults,
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'}
    },
    {
      id: '3',
      position: { x: -200, y: 150 },
      data: { label: 'Get Data' },
      ...nodeDefaults,
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'}
    },
    {
      id: '4',
      position: { x: 120, y: 150 },
      data: { label: 'APM Resend' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      ...nodeDefaults,
    },
    // Left side nodes (override targetPosition)
    {
      id: '5',
      position: { x: -500, y: 100 },
      data: { label: 'Dependencies Check' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
      
    },
    {
      id: '6',
      position: { x: -500, y: 150 },
      data: { label: 'Tool Health Check' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    },
    {
      id: '7',
      position: { x: -500, y: 200 },
      data: { label: 'Enviroment Check' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    },
    {
        id: '8',
        position: { x: 400, y: 150 },
        data: { label: 'Done' },
        style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
        sourcePosition: Position.Left,
        targetPosition: Position.Left,
      },
      {
        id: '9',
        position: { x: 250, y: 150 },
        data: { label: 'Verify Completion' },
        style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
        ...nodeDefaults
      }
  ];
  const initialEdges = [
    {
      id: 'e1-2',
      source: '3',
      target: '2',
      type: 'bezier',
      style: { stroke: '#00F500', strokeWidth: 2 },
      className: 'node-green-animated'
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'bezier',
      style: { stroke: '#00F500', strokeWidth: 2 },
      className: 'node-green-animated'
    },
    {
        id: 'e1-4',
        source: '2',
        target: '4',
        type: 'bezier',
        style: { stroke: '#00F500', strokeWidth: 2 },
        className: 'node-green-animated'
    },
    {
        id: 'e1-5',
        source: '5',
        target: '1',
        type: 'bezier',
        style: { stroke: '#FFA500', strokeWidth: 2, strokeDasharray: '5, 5' },
        className: 'node-green-animated'
    },
    {
        id: 'e1-6',
        source: '6',
        target: '1',
        type: 'bezier',
        style: { stroke: '#FFA500', strokeWidth: 2, strokeDasharray: '5, 5' },
        className: 'node-green-animated'
    },
    {
        id: 'e1-7',
        source: '7',
        target: '1',
        type: 'bezier',
        style: { stroke: '#FFA500', strokeWidth: 2, strokeDasharray: '5, 5' },
        className: 'node-green-animated'
    },
    {
        id: 'e1-8',
        source: '4',
        target: '9',
        type: 'bezier',
        style: { stroke: '#00F500', strokeWidth: 2 },
        className: 'node-green-animated'
    },
    {
        id: 'e1-9',
        source: '9',
        target: '8',
        type: 'bezier',
        style: { stroke: '#00F500', strokeWidth: 2 },
        className: 'node-green-animated'
    },
  ];
  
 
const Flowdesignerflowchart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
 
  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [],
  );
 
//   useEffect(() => {
//     const animationDelay = 4000; // time between starting each node's animation
//     const displayTime = 2000; // how long the green border stays before turning static
  
//     greenPath.forEach((id, index) => {
//       const entryDelay = index * animationDelay;
  
//       // Add animation class
//       setTimeout(() => {
//         setNodes((nds) =>
//           nds.map((node) =>
//             node.id === id ? { ...node, className: 'node-green-animated' } : node
//           )
//         );
//       }, entryDelay);
  
//       // Remove animation after displayTime
//       setTimeout(() => {
//         setNodes((nds) =>
//           nds.map((node) =>
//             node.id === id ? { ...node, className: 'node-green-static' } : node
//           )
//         );
//       }, entryDelay + displayTime);
//     });
//   }, [setNodes]);
  
const runFlowAnimation = () => {
    const animationDelay = 1500;
    const displayTime = 1000;
  
    greenPath.forEach((id, index) => {
      const entryDelay = index * animationDelay;
  
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, className: 'node-green-animated' } : node
          )
        );
      }, entryDelay);
  
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, className: 'node-green-static' } : node
          )
        );
      }, entryDelay + displayTime);
    });
  };
 
const handleClick =  async () => {
  try{
    runFlowAnimation();
  const resp = await fetch('/flow-api/execute', {
    method: 'GET',
  });
  const data = await resp.json();
  console.log(data);
 
  
 
  }catch(error) {
    console.error();
  }
}
  
 
  return (
    <div className='flow-container-desg'>
        
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
    <h2 className='flow-title-head' onClick={handleClick}><span className='flow-additional'>FLOW</span> DESIGNER</h2>
      <Background color="#242424" gap={10}/>
      <Controls />
      {/* <button onClick={handleClick} className='run-flow-button'>
        <PlayCircleFilled />
      </button> */}
    </ReactFlow>
    </div>
  );
};
 
export default Flowdesignerflowchart;
 
 