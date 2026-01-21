import React from "react";
import { useDispatch } from "react-redux";
import { addNodeToGroup } from "../store/nodesSlice";
import { Handle, Position } from "reactflow";
import { Button } from "primereact/button";
import { GROUP, NODE } from "../store/nodeConfig";

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
        background: data.style?.backgroundColor || "rgba(255, 255, 255, 0.5)",
        border: data.style?.border || GROUP.border + "px solid #555",
        borderRadius: data.style?.borderRadius || GROUP.borderRadius,
        width: data.style?.width || GROUP.width,
        height: data.style?.height || GROUP.height,
        position: data.style?.position || "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: "50%",
          left: -GROUP.handleSize / 2,
          width: GROUP.handleSize,
          height: GROUP.handleSize,
        }}
      />
      <div
        style={{
          fontWeight: "bold",
          textAlign: "center",
          position: "absolute",
          top: GROUP.verticalPadding,
          left: 0,
          right: 0,
        }}
      >
        {data.label}
      </div>

      <div
        style={{
          position: "absolute",
          left: (GROUP.width - NODE.width) / 2,
          bottom: GROUP.verticalPadding,
          width: NODE.width,
          height: GROUP.groupControlsHeight,
        }}
      >
        <Button
          icon="pi pi-plus"
          onClick={handleClick}
          size="small"
          style={{
            width: "100%",
          }}
        />
      </div>

      {/* Контейнер для дочерних нод */}
      {children}
    </div>
  );
};

export default ScreenGroupNode;
