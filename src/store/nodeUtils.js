/**
 * Служебные функции для манипуляций над нодами
 */

/**
 * Функция для создания новой ноды в группе
 * @param {string} groupId - ID группы
 * @param {Array} nodes - массив существующих нод
 * @returns {Object} - новая нода
 */
export const createNodeInGroup = (groupId, nodes) => {
  // Подсчитываем количество нод в группе
  const groupNodes = nodes.filter((n) => n.parentNode === groupId);
  const nodeCount = groupNodes.length;

  // Генерируем случайный цвет
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
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newNodeId = `${groupId}-node-${nodeCount + 1}`;
  const newNode = {
    id: newNodeId,
    type: "innerNode",
    position: { x: 20, y: 40 + nodeCount * 50 }, // Вертикальное расположение
    data: {
      label: `Node ${nodeCount + 1}`,
      color: randomColor,
    },
    parentNode: groupId,
    selectable: false,
  };

  return newNode;
};

/**
 * Функция для обновления размеров группы под размер списка нод
 * @param {Array} nodes - массив нод
 * @param {string} groupId - ID группы
 * @returns {Array} - обновленный массив нод
 */
export const updateGroupNodeDimensions = (nodes, groupId) => {
  const groupNode = nodes.find(n => n.id === groupId);
  if (!groupNode) return nodes;

  const groupChildren = nodes.filter(
    n => n.parentNode === groupId,
  );
  const newHeight = Math.max(100, 60 + groupChildren.length * 50);

  const updatedNodes = [...nodes];
  const groupNodeIndex = updatedNodes.findIndex(n => n.id === groupId);
  if (groupNodeIndex !== -1) {
    updatedNodes[groupNodeIndex] = {
      ...updatedNodes[groupNodeIndex],
      data: {
        ...updatedNodes[groupNodeIndex].data,
        style: {
          ...updatedNodes[groupNodeIndex].data?.style,
          height: newHeight,
        },
      },
    };
  }

  return updatedNodes;
};

/**
 * Функция для выстраивания позиций нод в группе
 * @param {Array} nodes - массив нод
 * @param {string} groupId - ID группы
 * @param {number} nodeHeight - высота ноды (по умолчанию 50)
 * @returns {Array} - обновленный массив нод
 */
export const arrangeNodePositions = (nodes, groupId, nodeHeight = 50) => {
  const groupNode = nodes.find(n => n.id === groupId);
  if (!groupNode) return nodes;

  // Находим все ноды, принадлежащие этой группе
  const groupNodes = nodes.filter(
    n => n.parentNode === groupId
  );

  // Сортируем ноды по Y-координате
  groupNodes.sort((a, b) => a.position.y - b.position.y);

  // Получаем размеры родительской группы из данных
  const parentHeight = groupNode.data?.style?.height || 220;

  // Распределяем ноды равномерно по вертикали
  const spacing = parentHeight / (groupNodes.length + 1); // равномерное распределение

  // Обновляем позиции всех нод в группе для вертикального упорядочивания
  const updatedNodes = [...nodes];
  groupNodes.forEach((n, index) => {
    const newPositionY = spacing * (index + 1) - nodeHeight / 2; // центрируем по высоте ноды

    const nodeToUpdateIndex = updatedNodes.findIndex(nodeToUpdate => nodeToUpdate.id === n.id);
    if (nodeToUpdateIndex !== -1) {
      updatedNodes[nodeToUpdateIndex] = {
        ...updatedNodes[nodeToUpdateIndex],
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

  return updatedNodes;
};