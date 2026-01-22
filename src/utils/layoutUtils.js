/**
 * Утилиты для автоматического размещения нод
 */

import ELK from 'elkjs/lib/elk.bundled.js';

// Инициализация ELK
const elk = new ELK();

/**
 * Функция для получения размещения элементов с помощью ELK
 * @param {Array} nodes - массив нод
 * @param {Array} edges - массив связей
 * @param {Object} options - опции для ELK
 * @returns {Promise<Object>} - объект с обновленными нодами и связями
 */
export const getLayoutedElements = async (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";

  // Разделяем ноды на групповые и внутренние
  const groupNodes = nodes.filter(node => !node.parentNode);
  const innerNodes = nodes.filter(node => node.parentNode);

  // Создаем временный граф для ELK
  const tempGraph = {
    id: "root",
    layoutOptions: {
      ...options,
      "spacing.nodeNode": "20", // Устанавливаем минимальное расстояние между нодами 20 пикселей
    },
    children: groupNodes.map((node) => ({
      ...JSON.parse(JSON.stringify(node)),
      // Настройка позиций хэндлов в зависимости от направления размещения
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Установка фиксированных размеров для ELK
      width: node.width || 150,
      height: node.height || 50,
    })),
    edges: [],
  };

  // Анализируем связи от внутренних нод к групповым нодам
  const processedEdges = [];
  const groupToGroupEdges = new Set(); // Для избежания дубликатов

  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    // Определяем групповые ноды, к которым принадлежат исходная и целевая ноды
    let sourceGroupNode = sourceNode;
    if (sourceNode?.parentNode) {
      sourceGroupNode = nodes.find(n => n.id === sourceNode.parentNode);
    }
    
    let targetGroupNode = targetNode;
    if (targetNode?.parentNode) {
      targetGroupNode = nodes.find(n => n.id === targetNode.parentNode);
    }

    // Если обе ноды принадлежат группам, создаем связь между групповыми нодами
    if (sourceGroupNode && targetGroupNode && sourceGroupNode.id !== targetGroupNode.id) {
      const edgeId = `${sourceGroupNode.id}-${targetGroupNode.id}`;

      if (!groupToGroupEdges.has(edgeId)) {
        processedEdges.push({
          ...JSON.parse(JSON.stringify(edge)),
          source: sourceGroupNode.id,
          target: targetGroupNode.id,
          id: edgeId,
        });
        groupToGroupEdges.add(edgeId);
      }
    }
  });

  // Добавляем обработанные связи к временному графу
  tempGraph.edges = processedEdges;

  try {
    const layoutedGraph = await elk.layout(tempGraph);

    if (layoutedGraph && layoutedGraph.children) {
      // Создаем карту новых позиций для групповых нод
      const newGroupPositions = {};
      layoutedGraph.children.forEach(node => {
        newGroupPositions[node.id] = { x: node.x, y: node.y };
      });

      // Обновляем позиции только групповых нод в исходном массиве
      const updatedNodes = nodes.map(node => {
        if (newGroupPositions[node.id]) {
          return {
            ...node,
            position: newGroupPositions[node.id],
          };
        }
        return node; // Внутренние ноды и неизмененные групповые ноды остаются без изменений
      });

      return {
        nodes: updatedNodes,
        edges: edges, // Сохраняем оригинальные связи
      };
    } else {
      // Возвращаем исходные данные, если ELK не смог их обработать
      return {
        nodes: nodes,
        edges: edges,
      };
    }
  } catch (error) {
    console.error('Ошибка при размещении элементов с помощью ELK:', error);
    // Возвращаем исходные данные в случае ошибки
    return {
      nodes: nodes,
      edges: edges,
    };
  }
};