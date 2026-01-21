import React from "react";
import { Handle, Position } from "reactflow";
import { NODE } from "../store/nodeConfig";

// Компонент вложенной ноды с уникальным ID
const InnerNode = ({ data, id }) => {
  return (
    <div
      style={{
        background: data.color || "#777",
        padding: data.style?.padding || 8,
        border: data.style?.border || Node.border + "px solid #fff",
        borderRadius: data.style?.borderRadius || NODE.borderRadius,
        textAlign: data.style?.textAlign || "center",
        width: data.style?.width || NODE.width,
        height: data.style?.height || NODE.height,
      }}
    >
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          position: "absolute",
          top: "50%",
          right: -NODE.handleSize / 2,
          width: NODE.handleSize,
          height: NODE.handleSize,
        }}
      />
    </div>
  );
};

export default InnerNode;
