import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
};

const nodesSlice = createSlice({
  name: 'nodes',
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
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex(node => node.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = action.payload;
      }
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    removeEdge: (state, action) => {
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    addNodeToGroup: (state, action) => {
      const { groupId, nodeData } = action.payload;

      // Добавляем новую ноду
      state.nodes.push(nodeData);

      // Обновляем размер группы
      const groupNode = state.nodes.find(n => n.id === groupId);
      if (groupNode) {
        const groupChildren = state.nodes.filter(n => n.parentNode === groupId);
        const newHeight = Math.max(100, 60 + groupChildren.length * 50);

        groupNode.data = {
          ...groupNode.data,
          style: {
            ...groupNode.data.style,
            height: newHeight
          }
        };
      }
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
} = nodesSlice.actions;

export default nodesSlice.reducer;