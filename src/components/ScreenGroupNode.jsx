import React from "react";
import { Handle, Position } from "reactflow";

// Компонент группы экрана с хэндлом типа Target
const ScreenGroupNode = ({ data, id }) => {
  return (
    <div
      style={{
        background: data.style?.backgroundColor || "rgba(200, 200, 200, 0.2)",
        border: data.style?.border || "2px solid #555",
        borderRadius: data.style?.borderRadius || "8px",
        width: data.style?.width || 150,
        height: data.style?.height || 150,
        position: "relative",
      }}
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
          right: 0
        }}
      >
        {data.label}
      </div>
    </div>
  );
};

export default ScreenGroupNode;