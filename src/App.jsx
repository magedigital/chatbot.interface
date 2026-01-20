import React, { useCallback, useEffect, useState } from "react";
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
  removeNode,
  clearAllScreenGroups,
} from "./store/nodesSlice";
import "reactflow/dist/style.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

import InnerNode from "./components/InnerNode";
import ScreenGroupNode from "./components/ScreenGroupNode";
import TopPanel from "./components/TopPanel";
import { createScreenGroup } from "./store/nodeUtils";

// Регистрация пользовательских типов нод
const nodeTypes = {
  innerNode: InnerNode,
  screenGroupNode: ScreenGroupNode,
};

const initialNodes = [];

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

  // Ограничение перемещения нод внутри их групп и автоматическое вертикальное упорядочивание
  const onNodeDragStop = useCallback(
    (event, node) => {
      // Используем Redux действие для обновления позиций нод в группе
      dispatch(updateNodePositionsInGroup({ node }));
    },
    [dispatch],
  );

  // Обработчик начала перетаскивания ноды - устанавливаем z-index для отображения поверх других нод
  const onNodeDragStart = useCallback(
    (event, node) => {
      // Проверяем, есть ли у ноды родительская группа
      if (node.parentNode) {
        // Находим все ноды в той же группе

        const siblingNodes = nodes.filter(
          (n) => n.parentNode === node.parentNode && n.id !== node.id,
        );

        // Находим максимальный z-index среди нод в группе
        const maxZIndex = siblingNodes.reduce((max, n) => {
          const zIndex = n.zIndex || 0;
          return zIndex > max ? zIndex : max;
        }, 0);

        // Устанавливаем z-index перетаскиваемой ноды на 1 больше максимального
        const updatedNode = {
          ...node,
          zIndex: maxZIndex + 1,
        };

        dispatch(updateNode(updatedNode));
      }
    },
    [nodes, dispatch],
  );

  // Ограничение перемещения ноды внутри её родительской группы во время перетаскивания
  const onNodeDrag = useCallback(
    (event, node) => {
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
          const maxX = parentWidth - nodeWidth;
          const maxY = parentHeight - nodeHeight;

          // Проверяем, нужно ли ограничить позицию ноды
          if (
            node.position.x < 0 ||
            node.position.x > maxX ||
            node.position.y < 0 ||
            node.position.y > maxY
          ) {
            // Корректируем позицию ноды, чтобы она оставалась внутри группы
            const correctedNode = {
              ...node,
              position: {
                x: Math.max(0, Math.min(node.position.x, maxX)),
                y: Math.max(0, Math.min(node.position.y, maxY)),
              },
            };
            dispatch(updateNode(correctedNode));
          }
        }
      }
    },
    [nodes, dispatch],
  );

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

  // Функция для добавления новой группы экрана
  const handleAddScreen = useCallback(() => {
    const newGroupNode = createScreenGroup(nodes);
    dispatch(addNode(newGroupNode));
  }, [dispatch, nodes]);

  // Функция для очистки всех групп
  const handleClearAllGroups = useCallback(() => {
    confirmDialog({
      message: 'Вы действительно хотите удалить все группы?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        // Вызываем Redux действие для очистки всех групп экранов
        dispatch(clearAllScreenGroups());
      },
      reject: () => {
        // Действие отменено, ничего не делаем
      }
    });
  }, [dispatch]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ConfirmDialog />
      <TopPanel onAddScreen={handleAddScreen} onClearAllGroups={handleClearAllGroups} />
      <div
        style={{
          width: "100%",
          height: "calc(100% - 60px)",
          position: "relative",
          top: "60px",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
