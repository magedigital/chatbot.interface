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
    updateNodePositionsInGroup: (state, action) => {
      const { node, nodeWidth = 180, nodeHeight = 50 } = action.payload;

      // Проверяем, есть ли у ноды родительская группа
      if (node.parentNode) {
        const parentNode = state.nodes.find(n => n.id === node.parentNode);
        if (parentNode) {
          // Получаем размеры родительской группы из данных
          const parentWidth = parentNode.data?.style?.width || 220;
          const parentHeight = parentNode.data?.style?.height || 220;

          // Ограничиваем координаты ноды в пределах родительской группы
          const newX = Math.max(0, Math.min(node.position.x, parentWidth - nodeWidth));
          const newY = Math.max(0, Math.min(node.position.y, parentHeight - nodeHeight));

          // Обновляем позицию ноды
          const nodeIndex = state.nodes.findIndex(n => n.id === node.id);
          if (nodeIndex !== -1) {
            state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], position: { x: newX, y: newY } };
          }

          // Находим все ноды, принадлежащие этой же группе
          const siblingNodes = state.nodes.filter(
            n => n.parentNode === node.parentNode && n.id !== node.id
          );

          // Добавляем текущую ноду в список для сортировки
          const allGroupNodes = [
            ...siblingNodes,
            { ...node, position: { x: newX, y: newY } }
          ];

          // Сортируем ноды по Y-координате
          allGroupNodes.sort((a, b) => a.position.y - b.position.y);

          // Распределяем ноды равномерно по вертикали
          const spacing = parentHeight / (allGroupNodes.length + 1); // равномерное распределение

          // Обновляем позиции всех нод в группе для вертикального упорядочивания
          allGroupNodes.forEach((n, index) => {
            const newPositionY = spacing * (index + 1) - nodeHeight / 2; // центрируем по высоте ноды

            const nodeToUpdateIndex = state.nodes.findIndex(nodeToUpdate => nodeToUpdate.id === n.id);
            if (nodeToUpdateIndex !== -1) {
              state.nodes[nodeToUpdateIndex] = {
                ...state.nodes[nodeToUpdateIndex],
                position: {
                  x: 20,
                  y: Math.max(
                    10,
                    Math.min(parentHeight - nodeHeight - 10, newPositionY)
                  )
                }
              };
            }
          });
        }
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
  updateNodePositionsInGroup,
} = nodesSlice.actions;

export default nodesSlice.reducer;