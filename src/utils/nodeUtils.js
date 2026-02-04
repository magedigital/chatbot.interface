/**
 * Служебные функции для манипуляций над нодами
 */

import { GROUP, NODE } from "../config/nodeConfig";

/**
 * Функция для создания новой ноды в группе
 * @param {string} groupId - ID группы
 * @param {Array} nodes - массив существующих нод
 */
export const createNodeInGroup = (groupId, nodes) => {
  // Подсчитываем количество нод в группе
  const groupNodes = nodes.filter((n) => n.parentNode === groupId);
  const nodeCount = groupNodes.length;

  const width = NODE.width;
  const height = NODE.height;

  const newNode = {
    id: groupId + NODE.uidSuffix + (nodeCount + 1),
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
      color: NODE.colors[nodeCount % NODE.colors.length],
      isStartScreenNode: false,
    },
    parentNode: groupId,
    selectable: false,
    extent: "parent",
  };

  return newNode;
};

/**
 * Функция для создания новой группы экрана
 * @param {Array} nodes - массив существующих нод
 */
export const createScreenGroup = (nodes) => {
  const groupCount = nodes.filter((n) => n.type === "screenGroupNode").length;

  const isStartScreen = groupCount === 0;

  const width = GROUP.width;
  const height = getGroupNodeHeight(0, isStartScreen);

  return {
    id: isStartScreen ? GROUP.mainUid : GROUP.uidPrefix + Date.now(),
    type: "screenGroupNode",
    position: {
      x: GROUP.initialX + groupCount * GROUP.offsetX,
      y: GROUP.initialY + groupCount * GROUP.offsetY,
    },
    width,
    height,
    data: {
      width,
      height,
      label: isStartScreen
        ? GROUP.mainName
        : GROUP.defaultName + ` ${groupCount + 1}`,
      style: {
        backgroundColor: GROUP.colors[groupCount % GROUP.colors.length],
        border: GROUP.border + "px solid " + GROUP.borderColor,
        borderRadius: GROUP.borderRadius,
      },
      isStartScreen,
    },
    selectable: isStartScreen,
    zIndex: nodes.reduce((max, n) => {
      const zIndex = n.zIndex || 0;
      return zIndex > max ? zIndex : max;
    }, 0),
    draggable: !isStartScreen,
  };
};

export const getGroupNodeHeight = (nodeCount, isStartScreen) => {
  return (
    GROUP.border * 2 +
    GROUP.topHeight +
    GROUP.verticalPadding * 2 +
    (nodeCount > 0 ? NODE.groupVerticalPadding * 2 : 0) +
    nodeCount * NODE.height +
    nodeCount * (NODE.groupVerticalSpacing - 1) +
    (isStartScreen
      ? 0
      : GROUP.controlsHeight +
        (nodeCount > 0 ? GROUP.verticalSpacing : 0 + GROUP.verticalSpacing))
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
  const height = getGroupNodeHeight(
    groupChildren.length,
    groupNode?.data?.isStartScreen,
  );
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
