import React, {
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
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

import { getLayoutedElements } from "../utils/layoutUtils";
import { elkOptions } from "../config/layoutConfig";
import { updateNodes, updateEdges } from "../store/nodesSlice";

const ReactFlowComponent = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();
  const {
    present: { nodes: storeNodes, edges: storeEdges },
  } = useSelector((state) => state.nodes);

  // Локальное состояние для nodes и edges
  const [nodes, setNodes] = useState(storeNodes);
  const [edges, setEdges] = useState(storeEdges);

  // Обновляем локальное состояние при изменении store
  useEffect(() => {
    setNodes(storeNodes);
    setEdges(storeEdges);
  }, [storeNodes, storeEdges]);

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
      const options = {
        ...elkOptions,
        ...layoutOptions,
      };

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(currentNodes, currentEdges, options);

      if (layoutedNodes && layoutedEdges) {
        dispatch(updateNodes(layoutedNodes));
        dispatch(updateEdges(layoutedEdges));
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

  // Обработчик начала перетаскивания ноды - устанавливаем z-index для отображения поверх других нод
  const onNodeDragStart = useCallback(
    (event, node) => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
      // Находим максимальный z-index среди всех нод
      const maxZIndex = nodes.reduce((max, n) => {
        const zIndex = n.zIndex || 0;
        return zIndex > max ? zIndex : max;
      }, 0);

      // Создаем копию массива нод
      let updatedNodes = [...nodes];

      // Если это групповая нода (имеет дочерние ноды), поднимаем её и все её внутренние ноды на передний план
      const childNodeIds = nodes
        .filter((n) => n.parentNode === node.id)
        .map((n) => n.id);

      if (childNodeIds.length > 0) {
        // Обновляем z-index для групповой ноды
        updatedNodes = updatedNodes.map((n) =>
          n.id === node.id ? { ...n, zIndex: maxZIndex + 1 } : n,
        );

        // Обновляем z-index для всех внутренних нод группы
        updatedNodes = updatedNodes.map((n) =>
          childNodeIds.includes(n.id) ? { ...n, zIndex: maxZIndex + 1 } : n,
        );
      } else if (node.parentNode) {
        // Если это внутренняя нода, поднимаем её и её родительскую группу на передний план
        const parentNode = nodes.find((n) => n.id === node.parentNode);
        if (parentNode) {
          updatedNodes = updatedNodes.map((n) =>
            n.id === parentNode.id ? { ...n, zIndex: maxZIndex + 1 } : n,
          );
        }

        // Обновляем z-index для всех внутренних нод в той же группе
        const siblingNodeIds = nodes
          .filter((n) => n.parentNode === node.parentNode)
          .map((n) => n.id);

        updatedNodes = updatedNodes.map((n) =>
          siblingNodeIds.includes(n.id)
            ? { ...n, zIndex: maxZIndex + (n.id === node.id ? 2 : 1) }
            : n,
        );
      } else {
        // Если это обычная нода (не групповая и не внутренняя), просто поднимаем её на передний план
        updatedNodes = updatedNodes.map((n) =>
          n.id === node.id ? { ...n, zIndex: maxZIndex + 1 } : n,
        );
      }
      setNodes(updatedNodes);
    },
    [nodes],
  );

  // Ограничение перемещения нод внутри их групп и автоматическое вертикальное упорядочивание
  const onNodeDragStop = useCallback(
    (event, node) => {
      if (timeoutID.current) clearTimeout(timeoutID.current);

      // Отправляем в store только обновленную ноду, а не все локальные ноды
      dispatch(updateNodePosition(node));

      if (node.parentNode) {
        // Используем Redux действие для обновления позиций нод в группе
        dispatch(updateNodePositionsInGroup({ node }));
      }
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

  // Функция для обновления нод
  const onNodesChange = useCallback(
    (changes) => {
      setNodes(prevNodes => {
        let updatedNodes = [...prevNodes];
        
        changes.forEach((change) => {
          if (change.type === "position" && change.position) {
            // Находим ноду, которую перемещают
            const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
            
            if (nodeIndex !== -1) {
              const node = updatedNodes[nodeIndex];
              
              // Обновляем позицию основной ноды
              updatedNodes[nodeIndex] = {
                ...node,
                position: change.position,
                dragging: change.dragging
              };
              
              // Если это групповая нода, перемещаем и все её дочерние ноды
              if (node.type === "screenGroupNode") {
                const deltaX = change.position.x - node.position.x;
                const deltaY = change.position.y - node.position.y;
                
                updatedNodes = updatedNodes.map(n => {
                  if (n.parentNode === node.id) {
                    // Перемещаем дочернюю ноду на ту же величину, что и родительская
                    return {
                      ...n,
                      position: {
                        x: n.position.x + deltaX,
                        y: n.position.y + deltaY
                      }
                    };
                  }
                  return n;
                });
              }
            }
          }
        });
        
        return updatedNodes;
      });
    },
    []
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
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeUpdate={onEdgeUpdate}
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
