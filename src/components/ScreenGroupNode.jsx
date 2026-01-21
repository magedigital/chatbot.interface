import React, { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addNodeToGroup, removeNode, removeGroupNode } from "../store/nodesSlice";
import { Handle, Position } from "reactflow";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { GROUP, NODE } from "../store/nodeConfig";

// Компонент группы экрана с хэндлом типа Target и возможностью добавления нод
const ScreenGroupNode = ({ data, id, children, onDeleteGroup }) => {
  const dispatch = useDispatch();
  const menu = useRef(null);
  const menuBtn = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();

    // Используем Redux действие для добавления ноды в группу
    dispatch(addNodeToGroup({ groupId: id }));
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    menu.current.toggle(e);
  };

  const handleEdit = () => {
    console.log("Clicked");
  };

  const handleDelete = useCallback(() => {
    if (onDeleteGroup) {
      onDeleteGroup();
    } else {
      // Резервный вариант удаления, если onDeleteGroup не передан
      confirmDialog({
        message: "Вы действительно хотите удалить эту группу?",
        header: "Подтверждение",
        icon: "pi pi-exclamation-triangle",
        acceptClassName: "p-button-danger",
        accept: () => {
          // Удаляем группу и все её дочерние ноды и соединения
          dispatch(removeGroupNode(id));
        },
        reject: () => {
          // Действие отменено, ничего не делаем
        },
      });
    }
  }, [id, dispatch, onDeleteGroup]);

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
        <Button
          ref={menuBtn}
          icon="pi pi-ellipsis-v"
          className="p-button-text p-button-plain"
          style={{
            marginLeft: "8px",
            padding: "2px",
            fontSize: "12px",
          }}
          onClick={handleMenuToggle}
        />
        <Menu
          ref={menu}
          model={menuItems}
          popup
          // onHide={() => menu && menu.current && menu.current.hide()}
        />
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
