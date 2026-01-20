/**
 * Служебные функции для манипуляций над нодами
 */

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