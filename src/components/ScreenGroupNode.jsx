import React from "react";
import { useDispatch } from "react-redux";
import { addNodeToGroup } from "../store/nodesSlice";
import { Handle, Position } from "reactflow";

// Компонент группы экрана с хэндлом типа Target и возможностью добавления нод
const ScreenGroupNode = ({ data, id, children }) => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation();

    // Используем Redux действие для добавления ноды в группу
    dispatch(addNodeToGroup({ groupId: id }));
  };

  return (
    <div
      style={{
        background: data.style?.backgroundColor || "rgba(200, 200, 200, 0.2)",
        border: data.style?.border || "2px solid #555",
        borderRadius: data.style?.borderRadius || "8px",
        width: data.style?.width || 220,
        height: data.style?.height || 100,
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
