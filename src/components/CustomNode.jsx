import React from "react";
import { Handle, Position } from "reactflow";

// Компонент пользовательской ноды с тремя кнопками
const CustomNode = ({ data, id }) => {
  const handleButtonClick = (buttonName) => {
    console.log(`Button ${buttonName} clicked in node ${id}`);
  };

  return (
    <div
      style={{
        background: data.color || "#f0f0f0",
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 4,
        width: 180,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ marginBottom: 10, fontWeight: "bold" }}>{data.label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button
          onClick={() => handleButtonClick("Button 1")}
          style={{ padding: "4px 8px", fontSize: "12px" }}
        >
          Button 1
        </button>
        <button
          onClick={() => handleButtonClick("Button 2")}
          style={{ padding: "4px 8px", fontSize: "12px" }}
        >
          Button 2
        </button>
        <button
          onClick={() => handleButtonClick("Button 3")}
          style={{ padding: "4px 8px", fontSize: "12px" }}
        >
          Button 3
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;