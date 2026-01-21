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
  removeEdge,
  clearAllScreenGroups,
} from "./store/nodesSlice";
import "reactflow/dist/style.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { PrimeReactProvider } from "primereact/api";

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
      // Проверяем, есть ли уже соединение от этого источника
      const existingEdge = edges.find((edge) => edge.source === params.source);
      if (existingEdge) {
        // Если есть, удаляем старое соединение
        dispatch(removeEdge(existingEdge.id));
      }

      // Создаем новое соединение
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        style: {
          strokeWidth: 3, // Устанавливаем толщину линии 3 пикселя
        },
        markerEnd: { type: "arrowclosed" },
        deletable: true,
        reconnectable: true,
        updatable: true,
      };

      dispatch(addEdgeAction(newEdge));
    },
    [dispatch, edges],
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

  // Обработчик двойного клика по ребру - удаление ребра
  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      dispatch(removeEdge(edge.id));
    },
    [dispatch],
  );

  // Обработчик обновления ребра
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      // Удаляем старое ребро
      dispatch(removeEdge(oldEdge.id));

      // Создаем новое ребро с обновленным соединением
      const updatedEdge = {
        ...newConnection,
        id: `edge-${newConnection.source}-${newConnection.target}`,
        style: {
          strokeWidth: 3, // Устанавливаем толщину линии 3 пикселя
        },
        markerEnd: { type: "arrowclosed" },
        deletable: true,
        reconnectable: true,
        updatable: true,
      };

      dispatch(addEdgeAction(updatedEdge));
    },
    [dispatch],
  );

  // Обработчик начала обновления ребра
  const onEdgeUpdateStart = useCallback((event, edge, handleType) => {
    // Начало перетаскивания ребра
  }, []);

  // Обработчик окончания обновления ребра
  const onEdgeUpdateEnd = useCallback(
    (event, edge, handleType) => {
      // Если ребро отпущено в пустом месте (без соединения с узлом), удаляем его
      if (!edge.target && !edge.sourceHandle) {
        dispatch(removeEdge(edge.id));
      }
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
      message: "Вы действительно хотите удалить все группы?",
      header: "Подтверждение",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        // Вызываем Redux действие для очистки всех групп экранов
        dispatch(clearAllScreenGroups());
      },
      reject: () => {
        // Действие отменено, ничего не делаем
      },
    });
  }, [dispatch]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <PrimeReactProvider
        value={{
          hideOverlaysOnDocumentScrolling: true,
        }}
      >
        <ConfirmDialog />
        <TopPanel
          onAddScreen={handleAddScreen}
          onClearAllGroups={handleClearAllGroups}
        />
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
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            nodeTypes={nodeTypes}
          >
            <Controls />
            <MiniMap />
            <Background
              variant="dots"
              gap={20}
              size={1}
              color="#E9B1A3"
              style={{ backgroundColor: "#2F435A" }}
            />
          </ReactFlow>
        </div>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
