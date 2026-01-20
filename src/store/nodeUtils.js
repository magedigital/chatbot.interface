/**
 * Служебные функции для манипуляций над нодами
 */

import { GROUP, NODE } from "./nodeConfig";

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

  const newGroupNode = {
    id: groupId,
    type: "screenGroupNode",
    position: { x, y },
    data: {
      label: `Screen Group ${groupCount + 1}`,
      style: {
        width: GROUP.width,
        height: GROUP.minGroupHeight, // начальная высота для пустой группы
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        border: "2px solid #555",
        borderRadius: "8px",
      },
    },
  };

  return newGroupNode;
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
  const newHeight = Math.max(
    GROUP.minGroupHeight,
    GROUP.groupHeadHeight +
      NODE.verticalPadding * 2 +
      groupChildren.length * NODE.height +
      groupChildren.length * (NODE.verticalSpacing - 1),
  );

  const updatedNodes = [...nodes];
  const groupNodeIndex = updatedNodes.findIndex((n) => n.id === groupId);
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
 * @param {number} nodeHeight - высота ноды (по умолчанию берется из NODE.height)
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
      GROUP.groupHeadHeight +
      NODE.verticalPadding +
      (NODE.height + NODE.verticalSpacing) * index; // центрируем по высоте ноды

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
