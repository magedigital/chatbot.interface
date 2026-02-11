import React, {
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from "reactflow";
import { useDispatch, useSelector } from "react-redux";
import {
  addScreenGroupNode,
  updateNodePositionsInGroup,
  removeEdge,
  addEdge as addEdgeAction,
  updateNode,
  updateNodePosition,
} from "../store/nodesSlice";

import InnerNode from "./InnerNode";
import ScreenGroupNode from "./ScreenGroupNode";

// var timeoutID;

const ReactFlowComponent = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();
  const {
    present: { nodes, edges },
  } = useSelector((state) => state.nodes);

  // Регистрация пользовательских типов нод
  const nodeTypes = useMemo(
    () => ({
      innerNode: InnerNode,
      screenGroupNode: ScreenGroupNode,
    }),
    [],
  );

  const timeoutID = useRef(null);

  // Экспортируем методы для взаимодействия с ReactFlow через ref
  useImperativeHandle(ref, () => ({
    addScreenAndNavigate: () => {
      const result = dispatch(addScreenGroupNode());
      const groupNode = result.payload;
      if (groupNode) {
        reactFlowInstance.fitBounds(
          {
            ...groupNode.position,
            width: groupNode.width,
            height: groupNode.height,
          },
          {
            duration: 500,
            ease: "smooth",
            padding: 1,
          },
        );
      }
      return groupNode.id;
    },
    fit: async (duration = 500) => {
      setTimeout(() => {
        reactFlowInstance.fitView({
          duration,
          ease: "smooth",
          padding: 0.1,
        });
      }, 100);
    },
    layout: async (currentNodes, currentEdges, layoutOptions) => {
      // Имитируем импорт getLayoutedElements внутри функции
      const { getLayoutedElements } = await import("../utils/layoutUtils");
      const { elkOptions } = await import("../config/layoutConfig");
      const { setNodes, setEdges } = await import("../store/nodesSlice");

      const options = {
        ...elkOptions,
        ...layoutOptions,
      };

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(currentNodes, currentEdges, options);

      if (layoutedNodes && layoutedEdges) {
        dispatch(setNodes(layoutedNodes));
        dispatch(setEdges(layoutedEdges));
        setTimeout(() => {
          reactFlowInstance.fitView({
            duration: 500,
            ease: "smooth",
            padding: 0.1,
          });
        }, 100);
      }
    },
  }));

  // Ограничение перемещения нод внутри их групп и автоматическое вертикальное упорядочивание
  const onNodeDragStop = useCallback(
    (event, node) => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
      // Используем Redux действие для обновления позиций нод в группе
      dispatch(updateNodePositionsInGroup({ node }));
    },
    [dispatch],
  );

  // Обработчик начала перетаскивания ноды - устанавливаем z-index для отображения поверх других нод
  const onNodeDragStart = useCallback(
    (event, node) => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
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
          if (change.dragging) {
            if (timeoutID.current) clearTimeout(timeoutID.current);
            timeoutID.current = setTimeout(() => {
              dispatch(updateNodePosition(change));
            }, 3);
          } else {
            dispatch(updateNodePosition(change));
          }
        }
      });
    },
    [nodes, dispatch],
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

  // Обработчик соединения
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

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeUpdate={onEdgeUpdate}
        // onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        nodeTypes={nodeTypes}
        zoomOnDoubleClick={false}
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
  );
});

export default ReactFlowComponent;
