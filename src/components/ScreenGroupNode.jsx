import React, { useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

// Компонент группы экрана с хэндлом типа Target и возможностью добавления нод
const ScreenGroupNode = ({ data, id, onAddInnerNode, children }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onAddInnerNode) {
      onAddInnerNode(id);
    }
  };

  // Вычисляем высоту на основе количества дочерних элементов
  const childNodes = React.Children.count(children);
  const dynamicHeight = Math.max(100, 60 + childNodes * 50); // минимальная высота 100, +50 на каждую ноду

  // Обновляем внутренние параметры ноды при изменении высоты
  useEffect(() => {
    updateNodeInternals(id);
  }, [dynamicHeight, id, updateNodeInternals]);

  return (
    <div
      style={{
        background: data.style?.backgroundColor || "rgba(200, 200, 200, 0.2)",
        border: data.style?.border || "2px solid #555",
        borderRadius: data.style?.borderRadius || "8px",
        width: data.style?.width || 220,
        height: dynamicHeight,
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

      <button
        onClick={handleClick}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          zIndex: 10,
          padding: "4px 8px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        Добавить ноду
      </button>

      {/* Контейнер для дочерних нод */}
      <div style={{ marginTop: 30 }}>{children}</div>
    </div>
  );
};

export default ScreenGroupNode;
