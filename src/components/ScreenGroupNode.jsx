import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";

// Компонент группы экрана с хэндлом типа Target и возможностью добавления нод
const ScreenGroupNode = ({ data, id, parentNode, useNodesState }) => {
  const [nodeCount, setNodeCount] = useState(0);

  // Функция для добавления новой ноды
  const addNode = useCallback((setNodes) => {
    if (typeof setNodes === 'function') {
      const newNodeId = `${id}-node-${nodeCount + 1}`;
      const newNode = {
        id: newNodeId,
        type: 'innerNode',
        position: { x: 20, y: 40 + (nodeCount * 50) }, // Вертикальное расположение
        data: {
          label: `Node ${nodeCount + 1}`,
          color: getRandomColor()
        },
        parentNode: id,
      };

      setNodes(prevNodes => [...prevNodes, newNode]);
      setNodeCount(prev => prev + 1);
    }
  }, [id, nodeCount]);

  // Функция для генерации случайного цвета
  const getRandomColor = () => {
    const colors = [
      "#ffebee", "#f3e5f5", "#e8eaf6", "#e0f2f1",
      "#e8f5e8", "#fff3e0", "#fbe9e7", "#efebe9"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: "50%", left: -8 }}
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

      {/* Кнопка для добавления новой ноды */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Вызов функции добавления ноды из родительского компонента
          if (typeof window.addScreenNode === 'function') {
            window.addScreenNode(id, nodeCount, setNodeCount);
          }
        }}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          zIndex: 10,
          padding: "4px 8px",
          fontSize: "12px",
          cursor: "pointer"
        }}
      >
        Добавить ноду
      </button>
    </div>
  );
};

export default ScreenGroupNode;
