import { createSlice } from "@reduxjs/toolkit";
import {
  arrangeNodePositions,
  createNodeInGroup,
  createScreenGroup,
  updateGroupNodeDimensions,
} from "../utils/nodeUtils";
import { MarkerType } from "reactflow";
import { NODE } from "../config/nodeConfig";

const initialState = {
  nodes: [],
  edges: [],
  dialogs: {
    editScreenDialog: null,
    editInnerNodeDialog: null,
  },
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

    removeGroupNode: (state, action) => {
      const groupId = action.payload;

      // Находим все ноды, принадлежащие этой группе
      const childNodes = state.nodes.filter(
        (node) => node.parentNode === groupId,
      );

      // Удаляем все внутренние ноды группы
      childNodes.forEach((childNode) => {
        state.nodes = state.nodes.filter((node) => node.id !== childNode.id);
      });

      // Удаляем все соединения, связанные с внутренними нодами и самой группой
      state.edges = state.edges.filter(
        (edge) =>
          !childNodes.some(
            (childNode) =>
              edge.source === childNode.id || edge.target === childNode.id,
          ) &&
          edge.source !== groupId &&
          edge.target !== groupId,
      );

      // Удаляем саму группу
      state.nodes = state.nodes.filter((node) => node.id !== groupId);
    },
    removeInnerNode: (state, action) => {
      const id = action.payload;
      const index = state.nodes.findIndex((node) => node.id === id);

      if (index !== -1) {
        const groupId = state.nodes[index]?.parentNode;

        // Удаляем все соединения, связанные с внутренней нодой
        state.edges = state.edges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        );

        // Удаляем саму ноду
        state.nodes = state.nodes.filter((node) => node.id !== id);

        // Обновляем размеры группы
        state.nodes = updateGroupNodeDimensions(state.nodes, groupId);

        // Вызываем внешнюю функцию для выстраивания позиций нод в группе
        state.nodes = arrangeNodePositions(state.nodes, groupId);
      }
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id,
      );
      if (index !== -1) {
        state.nodes[index] = action.payload;
      }
    },
    updateNodeData: (state, action) => {
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id,
      );
      if (index !== -1) {
        state.nodes[index] = {
          ...state.nodes[index],
          data: action.payload.data,
        };
      }
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

    // Редюсер для добавления новой групповой ноды
    addScreenGroupNode: (state, action) => {
      const newGroupNode = createScreenGroup(state.nodes);
      state.nodes.push(newGroupNode);

      const groupId = newGroupNode.id;

      // Обновляем размеры группы
      state.nodes = updateGroupNodeDimensions(state.nodes, groupId);

      // Вызываем внешнюю функцию для выстраивания позиций нод в группе
      state.nodes = arrangeNodePositions(state.nodes, groupId);

      action.payload = newGroupNode;

      if (newGroupNode.data.isStartScreen) {
        // Создаем новую ноду
        const newNode = createNodeInGroup(groupId, state.nodes);

        newNode.data.label = NODE.mainName;
        newNode.data.isStartScreenNode = true;
        newNode.draggable = false;
        newNode.selectable = true;

        // Добавляем новую ноду
        state.nodes.push(newNode);

        // Обновляем размеры группы
        state.nodes = updateGroupNodeDimensions(state.nodes, groupId);

        // Вызываем внешнюю функцию для выстраивания позиций нод в группе
        state.nodes = arrangeNodePositions(state.nodes, groupId);
      }
    },

    editScreenGroupNode: (state, action) => {
      if (!action.payload) {
        state.dialogs.editScreenDialog = null;
      } else {
        const index = state.nodes.findIndex(
          (node) => node.id === action.payload.groupId,
        );
        if (index !== -1) {
          state.dialogs.editScreenDialog = {
            id: state.nodes[index].id,
            data: state.nodes[index].data,
          };
        }
      }
    },

    editInnerNode: (state, action) => {
      if (!action.payload) {
        state.dialogs.editInnerNodeDialog = null;
      } else {
        const index = state.nodes.findIndex(
          (node) => node.id === action.payload.nodeId,
        );
        if (index !== -1) {
          state.dialogs.editInnerNodeDialog = {
            id: state.nodes[index].id,
            data: state.nodes[index].data,
          };
        }
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
  updateNodeData,
  addEdge,
  removeEdge,
  addNodeToGroup,
  updateNodePositionsInGroup,
  clearAllScreenGroups,
  removeGroupNode,
  removeInnerNode,
  addScreenGroupNode,
  editScreenGroupNode,
  editInnerNode,
} = nodesSlice.actions;

export default nodesSlice.reducer;
