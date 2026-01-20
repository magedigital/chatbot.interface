import React from "react";
import { useDispatch } from "react-redux";
import { addNodeToGroup } from "../store/nodesSlice";
import { Handle, Position } from "reactflow";
import { Button } from "primereact/button";
import { GROUP } from "../store/nodeConfig";

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
        style={{
          top: "50%",
          left: -8,
          width: 15,
          height: 15,
        }}
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

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: GROUP.groupHeadHeight,
          overflow: "hidden",
        }}
      >
        <Button
          icon="pi pi-plus"
          onClick={handleClick}
          className="p-button-sm p-button-outlined"
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
        />
      </div>

      {/* Контейнер для дочерних нод */}
      {children}
    </div>
  );
};

export default ScreenGroupNode;
