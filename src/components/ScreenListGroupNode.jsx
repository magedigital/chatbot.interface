import React, { useState, useCallback } from "react";
import { Handle, Position, useStore, useUpdateNodeInternals } from "reactflow";

// Компонент группы экрана с вертикальным списком нод и возможностью перетаскивания
const ScreenListGroupNode = ({ data, id, children, parentNode }) => {
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Получаем ноды, которые принадлежат этой группе
  const selector = useCallback((s) => s.nodeInternals, []);
  const nodes = useStore(selector);

  // Фильтруем ноды, принадлежащие этой группе
  const childNodes = Array.from(nodes.values()).filter(
    (node) => node.parentNode === id,
  );

  // Сортируем ноды по позиции Y для вертикального расположения
  const sortedChildNodes = [...childNodes].sort(
    (a, b) => a.position.y - b.position.y,
  );

  // Обработка начала перетаскивания
  const handleDragStart = (e, nodeId) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  // Обработка окончания перетаскивания
  const handleDragEnd = (e) => {
    e.stopPropagation();
    setDraggedNodeId(null);
  };

  // Обработка перемещения при перетаскивании
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!draggedNodeId) return;
  };

  return (
    <div
      style={{
        background: data.style?.backgroundColor || "rgba(200, 200, 200, 0.2)",
        border: data.style?.border || "2px solid #555",
        borderRadius: data.style?.borderRadius || "8px",
        width: data.style?.width || 220,
        height: data.style?.height || 220,
        position: "relative",
        overflow: "hidden",
      }}
      onDragOver={handleDragOver}
      onDrop={handleDragEnd}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: -8, left: "50%" }}
      />
      <div
        style={{
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
          position: "absolute",
          top: -25,
          left: 0,
          right: 0,
        }}
      >
        {data.label}
      </div>

      {/* Контейнер для дочерних нод */}
      <div style={{ marginTop: 20 }}>
        {sortedChildNodes.map((node, index) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => handleDragStart(e, node.id)}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              left: 10,
              top: 30 + index * 50, // Вертикальное расположение с отступами
              zIndex: draggedNodeId === node.id ? 100 : 1,
              cursor: "move",
              transition: draggedNodeId === node.id ? "none" : "top 0.3s ease",
            }}
          >
            {/* Здесь будет отображаться дочерняя нода */}
            {children && children[node.id]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScreenListGroupNode;
