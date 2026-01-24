import React, { useRef } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { NODE } from "../config/nodeConfig";

// Компонент вложенной ноды с уникальным ID
const InnerNode = ({ data, id, parentNode }) => {
  const menu = useRef(null);
  const menuBtn = useRef(null);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    menu.current.toggle(e);
  };

  const handleEdit = () => {
    console.log("Редактировать ноду", id);
  };

  const handleDelete = () => {
    if (parentNode && typeof window.deleteNodeFromGroup === 'function') {
      window.deleteNodeFromGroup(id);
    }
  };

  const menuItems = [
    {
      label: "Редактировать",
      icon: "pi pi-pencil",
      command: handleEdit,
    },
    {
      label: "Удалить",
      icon: "pi pi-trash",
      command: handleDelete,
    },
  ];

  return (
    <div
      style={{
        background: data.color || "#777",
        padding: data.style?.padding || 8,
        border:
          data.style?.border || NODE.border + "px solid " + NODE.borderColor,
        borderRadius: data.style?.borderRadius || NODE.borderRadius,
        width: data.style?.width || NODE.width,
        height: data.style?.height || NODE.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
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
          backgroundColor: NODE.handleBackgroundColor,
          borderColor: NODE.handleBorderColor,
        }}
      />
      <Button
        ref={menuBtn}
        icon="pi pi-ellipsis-v"
        className="p-button-text p-button-plain"
        size="small"
        style={{
          position: "absolute",
          top: -20,
          right: 0,
          width: "auto",
          paddingLeft: 4,
          paddingRight: 4,
        }}
        onClick={handleMenuToggle}
      />
      <Menu ref={menu} model={menuItems} popup />
    </div>
  );
};

export default InnerNode;
