import React from "react";
import { Handle, Position } from "reactflow";

// Компонент вложенной ноды с уникальным ID
const InnerNode = ({ data, id }) => {
  return (
    <div
      style={{
        background: data.color || "#f0f0f0",
        padding: 8,
        border: "1px solid #aaa",
        borderRadius: 4,
        textAlign: "center",
        width: 180,
      }}
    >
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ right: -8, top: "50%" }}
      />
    </div>
  );
};

export default InnerNode;