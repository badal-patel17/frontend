import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position
} from '@xyflow/react';

// import '@xyflow/react/dist/base.css';

import './SOMFlowChart.scss'
import { PlayCircleFilled, PlayCircleOutline, WatchLater } from '@mui/icons-material';
import Widget from '../widget/Widget';


const greenPath = ['5','6','7', '1', '3', '2', '4' ,'9' ,'8']

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
      position: { x: -50, y: 250 },
      data: { label: 'Generate Details' },
      ...nodeDefaults,
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'}
    },
    {
      id: '3',
      position: { x: -200, y: 150 },
      data: { label: 'Check BAN Status' },
      ...nodeDefaults,
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'}
    },
    {
      id: '4',
      position: { x: 95, y: 150 },
      data: { label: 'Update customer details' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      ...nodeDefaults,
    },
    // Left side nodes (override targetPosition)
    {
      id: '5',
      position: { x: -500, y: 50 },
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
      position: { x: -500, y: 250 },
      data: { label: 'Enviroment Check' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    },
    {
        id: '8',
        position: { x: 400, y: 150 },
        data: { label: 'End' },
        style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
        sourcePosition: Position.Left,
        targetPosition: Position.Left,
      },
      {
        id: '9',
        position: { x: 270, y: 150 },
        data: { label: 'APM Resend' },
        style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
        ...nodeDefaults
      },
      // {
      // id: '10',
      // position: { x: 150, y: 300 },
      // data: { label: 'Contact SOM' },
      // style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      // sourcePosition: Position.Right,
      // targetPosition: Position.Left,
      // },
      {
      id: '11',
      position: { x: -60, y: 150 },
      data: { label: 'TENTATIVE BAN Found' },
      style: {wordWrap: 'break-word', fontSize: 10, textAlign: 'center'},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      }
  ];
  const initialEdges = [
    {
      id: 'e1-2',
      source: '3',
      target: '2',
      type: 'bezier',
      style: { stroke: '#FFA500', strokeWidth: 2 },
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
        source: '3',
        target: '11',
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
    {
        id: 'e1-10',
        source: '2',
        target: '4',
        type: 'bezier',
        style: { stroke: '#00F500', strokeWidth: 2 },
        className: 'node-green-animated'
    },
    // {
    //     id: 'e1-11',
    //     source: '5',
    //     target: '3',
    //     type: 'bezier',
    //     style: { stroke: '#7F00FF', strokeWidth: 2 },
    //     className: 'node-green-animated'
    // },
    {
        id: 'e1-12',
        source: '10',
        target: '8',
        type: 'bezier',
        style: { stroke: '#FFA500', strokeWidth: 2 },
        className: 'node-green-animated'
    },
    {
        id: 'e1-13',
        source: '11',
        target: '4',
        type: 'bezier',
        style: { stroke: '#00F500', strokeWidth: 2 },
        className: 'node-green-animated'
    },
    // {
    //     id: 'e1-14',
    //     source: '3',
    //     target: '8',
    //     type: 'bezier',
    //     style: { stroke: '#FFA500', strokeWidth: 2, strokeDasharray: '5, 5'  },
    //     className: 'node-green-animated'
    // },
  ];

  
  

const Flowdesignerflowchart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [],
  );


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
  
// const runFlowAnimation = () => {
//     const animationDelay = 4000;
//     const displayTime = 3000;
  
//     greenPath.forEach((id, index) => {
//       const entryDelay = index * animationDelay;
  
//       setTimeout(() => {
//         setNodes((nds) =>
//           nds.map((node) =>
//             node.id === id ? { ...node, className: 'node-green-animated' } : node
//           )
//         );
//       }, entryDelay);
  
//       setTimeout(() => {
//         setNodes((nds) =>
//           nds.map((node) =>
//             node.id === id ? { ...node, className: 'node-red-static' } : node
//           )
//         );
//       }, entryDelay + displayTime);
//     });
//   };

const staticColors = {
//  '3': 'node-red-static',
};
const runFlowAnimation = () => {
 const animationDelay = 6000;
 const displayTime = 3000;
 greenPath.forEach((id, index) => {
   const entryDelay = index * animationDelay;
   // Start animation
   setTimeout(() => {
     setNodes((nds) =>
       nds.map((node) =>
node.id === id ? { ...node, className: 'node-green-animated' } : node
       )
     );
   }, entryDelay);
   // End animation → custom static color
   setTimeout(() => {
     setNodes((nds) =>
       nds.map((node) =>
node.id === id ? { ...node, className: staticColors[id] || 'node-green-static' } : node
       )
     );
   }, entryDelay + displayTime);
 });
};

const handleClick =  async () => {
  try{
    runFlowAnimation();
  const resp = await fetch('/flow-api/executebil', {
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
      {/* <button onClick={handleClick} className='run-flow-button'>
        <PlayCircleFilled />
      </button> */}
    </ReactFlow>
    </div>
  );
};

export default Flowdesignerflowchart;
