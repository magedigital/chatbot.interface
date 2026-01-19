import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

import CustomNode from "./components/CustomNode";
import InnerNode from "./components/InnerNode";
import ScreenGroupNode from "./components/ScreenGroupNode";

// Регистрация пользовательских типов нод
const nodeTypes = {
  customNode: CustomNode,
  innerNode: InnerNode,
  screenGroupNode: ScreenGroupNode,
};

// Определим вложенные ноды с уникальными ID
const screen1Nodes = [
  { id: "s1-n1", label: "Node A", color: "#ffebee" },
  { id: "s1-n2", label: "Node B", color: "#e8f5e8" },
  { id: "s1-n3", label: "Node C", color: "#fff3e0" },
];

const screen2Nodes = [
  { id: "s2-n1", label: "Node D", color: "#e3f2fd" },
  { id: "s2-n2", label: "Node E", color: "#fff9c4" },
  { id: "s2-n3", label: "Node F", color: "#f8bbd9" },
];

const screen3Nodes = [
  { id: "s3-n1", label: "Node G", color: "#dcedc8" },
  { id: "s3-n2", label: "Node H", color: "#ffccbc" },
  { id: "s3-n3", label: "Node I", color: "#e1bee7" },
];

const initialNodes = [
  {
    id: "1",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Input Node" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "Default Node" },
  },
  {
    id: "3",
    position: { x: 200, y: 100 },
    data: { label: "Output Node" },
    type: "output",
  },
  {
    id: "4",
    type: "customNode",
    position: { x: 100, y: 200 },
    data: { label: "Custom Node 1", color: "#f0f0f0" },
  },
  // Группа для Screen Node 1
  {
    id: "screen1-group",
    type: "screenGroupNode",
    position: { x: 250, y: 250 },
    data: {
      label: "Screen Node 1",
      style: {
        width: 150,
        height: 150,
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  },
  // Ноды для Screen Node 1
  {
    id: "s1-n1",
    type: "innerNode",
    position: { x: 10, y: 30 },
    data: { label: "Node A", color: "#ffebee" },
    parentNode: "screen1-group",
  },
  {
    id: "s1-n2",
    type: "innerNode",
    position: { x: 10, y: 70 },
    data: { label: "Node B", color: "#e8f5e8" },
    parentNode: "screen1-group",
  },
  {
    id: "s1-n3",
    type: "innerNode",
    position: { x: 10, y: 110 },
    data: { label: "Node C", color: "#fff3e0" },
    parentNode: "screen1-group",
  },
  // Группа для Screen Node 2
  {
    id: "screen2-group",
    type: "screenGroupNode",
    position: { x: 550, y: 150 },
    data: {
      label: "Screen Node 2",
      style: {
        width: 150,
        height: 150,
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  },
  // Ноды для Screen Node 2
  {
    id: "s2-n1",
    type: "innerNode",
    position: { x: 10, y: 30 },
    data: { label: "Node D", color: "#e3f2fd" },
    parentNode: "screen2-group",
  },
  {
    id: "s2-n2",
    type: "innerNode",
    position: { x: 10, y: 70 },
    data: { label: "Node E", color: "#fff9c4" },
    parentNode: "screen2-group",
  },
  {
    id: "s2-n3",
    type: "innerNode",
    position: { x: 10, y: 110 },
    data: { label: "Node F", color: "#f8bbd9" },
    parentNode: "screen2-group",
  },
  // Группа для Screen Node 3
  {
    id: "screen3-group",
    type: "screenGroupNode",
    position: { x: 550, y: 450 },
    data: {
      label: "Screen Node 3",
      style: {
        width: 150,
        height: 150,
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  },
  // Ноды для Screen Node 3
  {
    id: "s3-n1",
    type: "innerNode",
    position: { x: 10, y: 30 },
    data: { label: "Node G", color: "#dcedc8" },
    parentNode: "screen3-group",
  },
  {
    id: "s3-n2",
    type: "innerNode",
    position: { x: 10, y: 70 },
    data: { label: "Node H", color: "#ffccbc" },
    parentNode: "screen3-group",
  },
  {
    id: "s3-n3",
    type: "innerNode",
    position: { x: 10, y: 110 },
    data: { label: "Node I", color: "#e1bee7" },
    parentNode: "screen3-group",
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e4-s1n1", source: "4", target: "screen2-group" },
  { id: "s1n1-s2n1", source: "s1-n1", target: "s2-n1" }, // Соединение от ноды s1-n1 к Screen Node 2 (s2-n1)
  { id: "s1n2-s3n2", source: "s1-n2", target: "s3-n2" },
  { id: "s1n3-s2n3", source: "s1-n3", target: "s2-n3" },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Ограничение перемещения нод внутри их групп
  const onNodeDragStop = useCallback((event, node) => {
    // Проверяем, есть ли у ноды родительская группа
    if (node.parentNode) {
      const parentNode = nodes.find(n => n.id === node.parentNode);
      if (parentNode) {
        // Получаем размеры родительской группы
        const parentWidth = parentNode.width || 150;
        const parentHeight = parentNode.height || 150;

        // Получаем размеры самой ноды
        const nodeWidth = 180; // ширина ноды
        const nodeHeight = 50; // примерная высота ноды

        // Ограничиваем координаты ноды в пределах родительской группы
        const newX = Math.max(0, Math.min(node.position.x, parentWidth - nodeWidth));
        const newY = Math.max(0, Math.min(node.position.y, parentHeight - nodeHeight));

        // Если координаты выходят за пределы, возвращаем ноду в допустимые границы
        if (newX !== node.position.x || newY !== node.position.y) {
          setNodes(prevNodes =>
            prevNodes.map(n =>
              n.id === node.id ? { ...n, position: { x: newX, y: newY } } : n
            )
          );
        }
      }
    }
  }, [nodes, setNodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default App;
