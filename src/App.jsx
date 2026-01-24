import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import {
  setNodes,
  setEdges,
  addEdge as addEdgeAction,
  updateNode,
  updateNodePositionsInGroup,
  removeEdge,
  clearAllScreenGroups,
  addScreenGroupNode,
  addNodeToGroup,
} from "./store/nodesSlice";
import { getLayoutedElements } from "./utils/layoutUtils";
import "reactflow/dist/style.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { PrimeReactProvider } from "primereact/api";

import InnerNode from "./components/InnerNode";
import ScreenGroupNode from "./components/ScreenGroupNode";
import TopPanel from "./components/TopPanel";
import { elkOptions } from "./config/layoutConfig";
import DialogManager from "./components/DialogManager";

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
      // Находим максимальный z-index среди всех нод
      const maxZIndex = nodes.reduce((max, n) => {
        const zIndex = n.zIndex || 0;
        return zIndex > max ? zIndex : max;
      }, 0);

      // Если это групповая нода (имеет дочерние ноды), поднимаем её и все её внутренние ноды на передний план
      const childNodes = nodes.filter((n) => n.parentNode === node.id);
      if (childNodes.length > 0) {
        // Обновляем z-index для групповой ноды
        const updatedGroupNode = {
          ...node,
          zIndex: maxZIndex + 1,
        };
        dispatch(updateNode(updatedGroupNode));

        // Обновляем z-index для всех внутренних нод группы
        childNodes.forEach((childNode) => {
          const updatedChildNode = {
            ...childNode,
            zIndex: maxZIndex + 1,
          };
          dispatch(updateNode(updatedChildNode));
        });
      } else if (node.parentNode) {
        // Если это внутренняя нода, поднимаем её и её родительскую группу на передний план
        const parentNode = nodes.find((n) => n.id === node.parentNode);
        if (parentNode) {
          // Обновляем z-index для родительской группы
          const updatedParentNode = {
            ...parentNode,
            zIndex: maxZIndex + 1,
          };
          dispatch(updateNode(updatedParentNode));

          // Обновляем z-index для всех внутренних нод в той же группе
          const siblingNodes = nodes.filter(
            (n) => n.parentNode === node.parentNode,
          );
          siblingNodes.forEach((siblingNode) => {
            const updatedSiblingNode = {
              ...siblingNode,
              zIndex: maxZIndex + (siblingNode.id === node.id ? 2 : 1),
            };
            dispatch(updateNode(updatedSiblingNode));
          });
        }
      } else {
        // Если это обычная нода (не групповая и не внутренняя), просто поднимаем её на передний план
        const updatedNode = {
          ...node,
          zIndex: maxZIndex + 1,
        };
        dispatch(updateNode(updatedNode));
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
    dispatch(addScreenGroupNode());
  }, [dispatch]);

  // Функция для автоматического вертикального размещения нод с использованием ELK
  const handleLayoutVertical = useCallback(() => {
    // Опции для ELK с вертикальным направлением
    const options = {
      ...elkOptions,
      "elk.direction": "DOWN",
    };

    // Применяем размещение к текущим нодам и связям
    getLayoutedElements(nodes, edges, options).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        if (layoutedNodes && layoutedEdges) {
          dispatch(setNodes(layoutedNodes));
          dispatch(setEdges(layoutedEdges));
        }
      },
    );
  }, [nodes, edges, dispatch]);

  // Функция для автоматического горизонтального размещения нод с использованием ELK
  const handleLayoutHorizontal = useCallback(() => {
    // Опции для ELK с горизонтальным направлением
    const options = {
      ...elkOptions,
      "elk.direction": "RIGHT",
    };

    // Применяем размещение к текущим нодам и связям
    getLayoutedElements(nodes, edges, options).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        if (layoutedNodes && layoutedEdges) {
          dispatch(setNodes(layoutedNodes));
          dispatch(setEdges(layoutedEdges));
        }
      },
    );
  }, [nodes, edges, dispatch]);

  // Функция для автоматического размещения нод по алгоритму rectpacking
  const handleLayoutRectPacking = useCallback(() => {
    // Опции для ELK с алгоритмом rectpacking
    const options = {
      ...elkOptions,
      "elk.algorithm": "rectpacking",
    };

    // Применяем размещение к текущим нодам и связям
    getLayoutedElements(nodes, edges, options).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        if (layoutedNodes && layoutedEdges) {
          dispatch(setNodes(layoutedNodes));
          dispatch(setEdges(layoutedEdges));
        }
      },
    );
  }, [nodes, edges, dispatch]);

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
        <DialogManager />
        <TopPanel
          onAddScreen={handleAddScreen}
          onClearAllGroups={handleClearAllGroups}
          onLayoutVertical={handleLayoutVertical}
          onLayoutHorizontal={handleLayoutHorizontal}
          onLayoutRectPacking={handleLayoutRectPacking}
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
