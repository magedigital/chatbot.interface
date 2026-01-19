import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import InnerNode from "./components/InnerNode";
import ScreenGroupNode from "./components/ScreenGroupNode";
import ScreenGroupNodeWrapper from "./components/ScreenGroupNodeWrapper";

// Регистрация пользовательских типов нод
const nodeTypes = {
  innerNode: InnerNode,
  screenGroupNode: (props) => <ScreenGroupNodeWrapper {...props} />,
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Функция для добавления новой ноды в группу
  const addNodeToScreenGroup = useCallback(
    (groupId, nodeCount) => {
      const newNodeId = `${groupId}-node-${nodeCount + 1}`;
      const newNode = {
        id: newNodeId,
        type: "innerNode",
        position: { x: 20, y: 40 + nodeCount * 50 }, // Вертикальное расположение
        data: {
          label: `Node ${nodeCount + 1}`,
          color: getRandomColor(),
        },
        parentNode: groupId,
      };

      // Обновляем размер группы в зависимости от количества нод
      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes, newNode];

        // Находим группу и увеличиваем её размер
        const groupNodeIndex = updatedNodes.findIndex((n) => n.id === groupId);
        if (groupNodeIndex !== -1) {
          const groupNode = updatedNodes[groupNodeIndex];
          const newHeight = Math.max(100, 60 + (nodeCount + 1) * 50); // увеличиваем высоту на 50 пикселей на каждую ноду

          updatedNodes[groupNodeIndex] = {
            ...groupNode,
            data: {
              ...groupNode.data,
              style: {
                ...groupNode.data.style,
                height: newHeight,
              },
            },
          };
        }

        return updatedNodes;
      });
    },
    [nodes, setNodes],
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
      // Проверяем, есть ли у ноды родительская группа
      if (node.parentNode) {
        const parentNode = nodes.find((n) => n.id === node.parentNode);
        if (parentNode) {
          // Получаем размеры родительской группы из данных
          const parentWidth = parentNode.data?.style?.width || 220;
          const parentHeight = parentNode.data?.style?.height || 220;

          // Получаем размеры самой ноды
          const nodeWidth = 180; // ширина ноды
          const nodeHeight = 50; // примерная высота ноды

          // Ограничиваем координаты ноды в пределах родительской группы
          const newX = Math.max(
            0,
            Math.min(node.position.x, parentWidth - nodeWidth),
          );
          const newY = Math.max(
            0,
            Math.min(node.position.y, parentHeight - nodeHeight),
          );

          // Обновляем позицию ноды
          let updatedNodes = nodes.map((n) =>
            n.id === node.id ? { ...n, position: { x: newX, y: newY } } : n,
          );

          // Находим все ноды, принадлежащие этой же группе
          const siblingNodes = updatedNodes.filter(
            (n) => n.parentNode === node.parentNode && n.id !== node.id,
          );

          // Добавляем текущую ноду в список для сортировки
          const allGroupNodes = [
            ...siblingNodes,
            { ...node, position: { x: newX, y: newY } },
          ];

          // Сортируем ноды по Y-координате
          allGroupNodes.sort((a, b) => a.position.y - b.position.y);

          // Распределяем ноды равномерно по вертикали
          const spacing = parentHeight / (allGroupNodes.length + 1); // равномерное распределение

          // Обновляем позиции всех нод в группе для вертикального упорядочивания
          allGroupNodes.forEach((n, index) => {
            const newPositionY = spacing * (index + 1) - nodeHeight / 2; // центрируем по высоте ноды

            updatedNodes = updatedNodes.map((nodeToUpdate) =>
              nodeToUpdate.id === n.id
                ? {
                    ...nodeToUpdate,
                    position: {
                      x: 20,
                      y: Math.max(
                        10,
                        Math.min(parentHeight - nodeHeight - 10, newPositionY),
                      ),
                    },
                  }
                : nodeToUpdate,
            );
          });

          setNodes(updatedNodes);
        }
      }
    },
    [nodes, setNodes],
  );

  // Обновляем window объект для доступа к функции из компонента
  useEffect(() => {
    window.addScreenNode = (groupId, nodeCount, setNodeCount) => {
      // Подсчитываем актуальное количество нод в группе
      const currentGroupNodes = nodes.filter((n) => n.parentNode === groupId);
      const currentCount = currentGroupNodes.length;
      addNodeToScreenGroup(groupId, currentCount);
      // setNodeCount не используется, так как состояние управляется внутри ReactFlow
    };
  }, [addNodeToScreenGroup, nodes]);

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
