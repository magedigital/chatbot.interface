import { createSlice } from "@reduxjs/toolkit";
import {
  arrangeNodePositions,
  createNodeInGroup,
  updateGroupNodeDimensions,
} from "./nodeUtils";
import { MarkerType } from "reactflow";

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
};

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id,
      );
      if (index !== -1) {
        state.nodes[index] = action.payload;
      }
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    addEdge: (state, action) => {
      const newEdge = {
        ...action.payload,
        id: `edge-${action.payload.source}-${action.payload.target}`,
        style: {
          strokeWidth: 3, // Устанавливаем толщину линии 3 пикселя
        },
        markerEnd: { type: MarkerType.ArrowClosed },
        deletable: true,
        reconnectable: true, // Разрешаем переподключение
        updatable: true, // Разрешаем обновление соединений
      };
      state.edges.push(newEdge);
    },
    removeEdge: (state, action) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
    },
    addNodeToGroup: (state, action) => {
      const { groupId } = action.payload;

      // Создаем новую ноду
      const newNode = createNodeInGroup(groupId, state.nodes);

      // Добавляем новую ноду
      state.nodes.push(newNode);

      // Обновляем размеры группы
      state.nodes = updateGroupNodeDimensions(state.nodes, groupId);

      // Вызываем внешнюю функцию для выстраивания позиций нод в группе
      state.nodes = arrangeNodePositions(state.nodes, groupId);
    },
    updateNodePositionsInGroup: (state, action) => {
      const { node } = action.payload;
      // Проверяем, есть ли у ноды родительская группа
      if (node.parentNode) {
        // Вызываем внешнюю функцию для выстраивания позиций нод в группе
        state.nodes = arrangeNodePositions(state.nodes, node.parentNode);
      }
    },

    // Редюсер для очистки всех групп экранов
    clearAllScreenGroups: (state) => {
      // Находим все группы экранов (ноды типа 'screenGroupNode')
      const screenGroupIds = state.nodes
        .filter((n) => n.type === "screenGroupNode")
        .map((group) => group.id);

      // Удаляем все ноды, которые принадлежат этим группам (включая дочерние ноды)
      state.nodes = state.nodes
        .filter(
          (node) =>
            !node.parentNode || !screenGroupIds.includes(node.parentNode),
        )
        .filter(
          (node) =>
            // Также удаляем сами группы экранов
            !screenGroupIds.includes(node.id),
        );
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNode,
  removeNode,
  updateNode,
  setSelectedNode,
  addEdge,
  removeEdge,
  addNodeToGroup,
  updateNodePositionsInGroup,
  clearAllScreenGroups,
} = nodesSlice.actions;

export default nodesSlice.reducer;
