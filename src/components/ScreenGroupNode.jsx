import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNodeToGroup } from "../store/nodesSlice";
import { Handle, Position } from "reactflow";

// Компонент группы экрана с хэндлом типа Target и возможностью добавления нод
const ScreenGroupNode = ({ data, id, children }) => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes.nodes);

  const handleClick = (e) => {
    e.stopPropagation();

    // Подсчитываем количество нод в группе
    const groupNodes = nodes.filter(n => n.parentNode === id);
    const nodeCount = groupNodes.length;

    // Генерируем случайный цвет
    const colors = [
      "#ffebee", "#f3e5f5", "#e8eaf6", "#e0f2f1",
      "#e8f5e8", "#fff3e0", "#fbe9e7", "#efebe9"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNodeId = `${id}-node-${nodeCount + 1}`;
    const newNode = {
      id: newNodeId,
      type: "innerNode",
      position: { x: 20, y: 40 + nodeCount * 50 }, // Вертикальное расположение
      data: {
        label: `Node ${nodeCount + 1}`,
        color: randomColor,
      },
      parentNode: id,
    };

    // Используем Redux действие для добавления ноды в группу
    dispatch(addNodeToGroup({ groupId: id, nodeData: newNode }));
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
