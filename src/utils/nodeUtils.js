/**
 * Служебные функции для манипуляций над нодами
 */

import { GROUP, NODE } from "../config/nodeConfig";

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

  // Выбираем цвет последовательно по индексу
  const colorIndex = nodeCount % NODE.colors.length;
  const selectedColor = NODE.colors[colorIndex];

  const newNodeId = `${groupId}-node-${nodeCount + 1}`;

  const width = NODE.width;
  const height = NODE.height;

  const newNode = {
    id: newNodeId,
    type: "innerNode",
    position: {
      x: (GROUP.width - NODE.width) / 2,
      y:
        GROUP.verticalPadding +
        GROUP.topHeight +
        GROUP.verticalSpacing +
        NODE.groupVerticalPadding +
        (NODE.height + NODE.groupVerticalSpacing) * nodeCount,
    }, // Вертикальное расположение
    width,
    height,
    data: {
      label: NODE.defaultName + ` ${nodeCount + 1}`,
      color: selectedColor,
    },
    parentNode: groupId,
    selectable: false,
    extent: "parent",
  };

  return newNode;
};

/**
 * Функция для создания новой группы экрана
 * @param {Array} existingNodes - массив существующих нод
 * @param {number} offsetX - смещение по X для новой группы
 * @param {number} offsetY - смещение по Y для новой группы
 * @returns {Object} - новая группа нод
 */
export const createScreenGroup = (
  existingNodes,
  offsetX = GROUP.offsetX,
  offsetY = GROUP.offsetY,
) => {
  const groupCount = existingNodes.filter(
    (n) => n.type === "screenGroupNode",
  ).length;
  const groupId = `screen-group-${Date.now()}`;

  // Рассчитываем координаты с учетом количества существующих групп
  const x = GROUP.initialX + groupCount * offsetX;
  const y = GROUP.initialY + groupCount * offsetY;

  const colorIndex = groupCount % GROUP.colors.length;
  const selectedColor = GROUP.colors[colorIndex];

  const maxZIndex = existingNodes.reduce((max, n) => {
    const zIndex = n.zIndex || 0;
    return zIndex > max ? zIndex : max;
  }, 0);

  const width = GROUP.width;
  const height = getGroupNodeHeight(0);

  const isStartScreen = groupCount === 0;

  const newGroupNode = {
    id: groupId,
    type: "screenGroupNode",
    position: { x, y },
    width,
    height,
    data: {
      width,
      height,
      label: isStartScreen
        ? GROUP.mainName
        : GROUP.defaultName + ` ${groupCount + 1}`,
      style: {
        backgroundColor: selectedColor,
        border: GROUP.border + "px solid " + GROUP.borderColor,
        borderRadius: GROUP.borderRadius,
      },
      isStartScreen,
    },
    selectable: isStartScreen,
    zIndex: maxZIndex,
    draggable: !isStartScreen,
  };

  return newGroupNode;
};

export const getGroupNodeHeight = (nodeCount) => {
  return (
    GROUP.border * 2 +
    GROUP.topHeight +
    GROUP.verticalPadding * 2 +
    (nodeCount > 0 ? NODE.groupVerticalPadding * 2 : 0) +
    nodeCount * NODE.height +
    nodeCount * (NODE.groupVerticalSpacing - 1) +
    GROUP.controlsHeight +
    (nodeCount > 0 ? GROUP.verticalSpacing : 0) +
    GROUP.verticalSpacing
  );
};

/**
 * Функция для обновления размеров группы под размер списка нод
 * @param {Array} nodes - массив нод
 * @param {string} groupId - ID группы
 * @returns {Array} - обновленный массив нод
 */
export const updateGroupNodeDimensions = (nodes, groupId) => {
  const groupNode = nodes.find((n) => n.id === groupId);
  if (!groupNode) return nodes;

  const groupChildren = nodes.filter((n) => n.parentNode === groupId);

  const updatedNodes = [...nodes];
  const groupNodeIndex = updatedNodes.findIndex((n) => n.id === groupId);
  const height = getGroupNodeHeight(groupChildren.length);
  if (groupNodeIndex !== -1) {
    updatedNodes[groupNodeIndex] = {
      ...updatedNodes[groupNodeIndex],
      height,
      data: {
        ...updatedNodes[groupNodeIndex].data,
        style: {
          ...updatedNodes[groupNodeIndex].data?.style,
        },
        height,
      },
    };
  }

  return updatedNodes;
};

/**
 * Функция для выстраивания позиций нод в группе
 * @param {Array} nodes - массив нод
 * @param {string} groupId - ID группы
 * @returns {Array} - обновленный массив нод
 */
export const arrangeNodePositions = (nodes, groupId) => {
  const groupNode = nodes.find((n) => n.id === groupId);

  if (!groupNode) return nodes;

  // Находим все ноды, принадлежащие этой группе
  const groupNodes = nodes.filter((n) => n.parentNode === groupId);

  // Сортируем ноды по Y-координате
  groupNodes.sort((a, b) => a.position.y - b.position.y);

  // Обновляем позиции всех нод в группе для вертикального упорядочивания
  const updatedNodes = [...nodes];
  groupNodes.forEach((n, index) => {
    const newPositionY =
      GROUP.topHeight +
      GROUP.verticalPadding +
      GROUP.verticalSpacing +
      NODE.groupVerticalPadding +
      (NODE.height + NODE.groupVerticalSpacing) * index; // центрируем по высоте ноды

    const nodeToUpdateIndex = updatedNodes.findIndex(
      (nodeToUpdate) => nodeToUpdate.id === n.id,
    );
    if (nodeToUpdateIndex !== -1) {
      updatedNodes[nodeToUpdateIndex] = {
        ...updatedNodes[nodeToUpdateIndex],
        position: {
          x: (GROUP.width - NODE.width) / 2,
          y: newPositionY,
        },
      };
    }
  });

  return updatedNodes;
};
