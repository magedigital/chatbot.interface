import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import {
  setNodes,
  setEdges,
  addNode,
  addEdge as addEdgeAction,
  updateNode,
  addNodeToGroup,
  updateNodePositionsInGroup,
} from "./store/nodesSlice";
import "reactflow/dist/style.css";

import InnerNode from "./components/InnerNode";
import ScreenGroupNode from "./components/ScreenGroupNode";

// Регистрация пользовательских типов нод
const nodeTypes = {
  innerNode: InnerNode,
  screenGroupNode: ScreenGroupNode,
};

const initialNodes = [
  // Группа для Screen Node 1 (без начальных нод)
  {
    id: "screen1-group",
    type: "screenGroupNode",
    position: { x: 250, y: 250 },
    data: {
      label: "Screen Node 1",
      style: {
        width: 220,
        height: 100,
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  },
  // Группа для Screen Node 2 (без начальных нод)
  {
    id: "screen2-group",
    type: "screenGroupNode",
    position: { x: 550, y: 150 },
    data: {
      label: "Screen Node 2",
      style: {
        width: 220,
        height: 100,
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  },
  // Группа для Screen Node 3 (без начальных нод)
  {
    id: "screen3-group",
    type: "screenGroupNode",
    position: { x: 550, y: 450 },
    data: {
      label: "Screen Node 3",
      style: {
        width: 220,
        height: 100,
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  },
];

const initialEdges = [];

function App() {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.nodes);

  // Инициализация начальных данных
  useEffect(() => {
    dispatch(setNodes(initialNodes));
    dispatch(setEdges(initialEdges));
  }, [dispatch]);

  const onConnect = useCallback(
    (params) => {
      dispatch(addEdgeAction(params));
    },
    [dispatch],
  );

  // Функция для генерации случайного цвета
  const getRandomColor = () => {
    const colors = [
      "#ffebee",
      "#f3e5f5",
      "#e8eaf6",
      "#e0f2f1",
      "#e8f5e8",
      "#fff3e0",
      "#fbe9e7",
      "#efebe9",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Ограничение перемещения нод внутри их групп и автоматическое вертикальное упорядочивание
  const onNodeDragStop = useCallback(
    (event, node) => {
      // Используем Redux действие для обновления позиций нод в группе
      dispatch(updateNodePositionsInGroup({ node }));
    },
    [dispatch],
  );

  // Ограничение перемещения ноды внутри её родительской группы во время перетаскивания
  const onNodeDrag = useCallback((event, node) => {
    if (node.parentNode) {
      const parentNode = nodes.find(n => n.id === node.parentNode);
      if (parentNode) {
        // Получаем размеры родительской группы из данных
        const parentWidth = parentNode.data?.style?.width || 220;
        const parentHeight = parentNode.data?.style?.height || 220;

        // Получаем размеры самой ноды
        const nodeWidth = 180; // ширина ноды
        const nodeHeight = 50; // примерная высота ноды

        // Ограничиваем координаты ноды в пределах родительской группы
        const maxX = parentWidth - nodeWidth;
        const maxY = parentHeight - nodeHeight;

        // Проверяем, нужно ли ограничить позицию ноды
        if (node.position.x < 0 || node.position.x > maxX || node.position.y < 0 || node.position.y > maxY) {
          // Корректируем позицию ноды, чтобы она оставалась внутри группы
          const correctedNode = {
            ...node,
            position: {
              x: Math.max(0, Math.min(node.position.x, maxX)),
              y: Math.max(0, Math.min(node.position.y, maxY))
            }
          };
          dispatch(updateNode(correctedNode));
        }
      }
    }
  }, [nodes, dispatch]);

  // Функция для обновления нод
  const onNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const updatedNode = {
              ...node,
              position: change.position,
            };
            dispatch(updateNode(updatedNode));
          }
        }
      });
    },
    [nodes, dispatch],
  );

  // Функция для обновления связей
  const onEdgesChange = useCallback(
    (changes) => {
      // В данном случае, изменения связей обрабатываются через onConnect
    },
    [dispatch],
  );

  // Удаляем глобальную функцию, так как теперь используем Redux напрямую в компоненте

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
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
