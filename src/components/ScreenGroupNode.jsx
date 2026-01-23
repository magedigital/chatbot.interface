import React, { useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  addNodeToGroup,
  removeNode,
  removeGroupNode,
  updateNode,
  updateNodeData,
} from "../store/nodesSlice";
import { Handle, Position } from "reactflow";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { GROUP, NODE } from "../config/nodeConfig";
import EditGroupDialog from "./EditGroupDialog";

// Компонент группы экрана с хэндлом типа Target и возможностью добавления нод
const ScreenGroupNode = ({ data, id, children, onDeleteGroup }) => {
  const dispatch = useDispatch();
  const menu = useRef(null);
  const menuBtn = useRef(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

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
    setEditDialogVisible(true);
  };

  const handleSaveEdit = (data) => {
    dispatch(updateNodeData({ id, data }));
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
        position: data.style?.position || "relative",
        width: data.width || GROUP.width,
        height: data.height || GROUP.height,
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
          backgroundColor: GROUP.handleBackgroundColor,
          borderColor: GROUP.handleBorderColor,
        }}
      />
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          top: GROUP.verticalPadding,
          left: (GROUP.width - NODE.width) / 2,
          width: NODE.width,
          height: GROUP.topHeight,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            position: "relative",
            maxheight: GROUP.topHeight,
            display: "-webkit-box",
            textOverflow: "ellipsis",
            "-webkit-line-clamp": "2",
            "-webkit-box-orient": "vertical",
            lineHeight: "120%",
            overflowWrap: "break-word",
            overflow: "hidden",
          }}
        >
          {data.label}
        </div>
        <Button
          ref={menuBtn}
          icon="pi pi-ellipsis-v"
          className="p-button-text p-button-plain"
          size="small"
          style={{
            width: "auto",
            paddingLeft: 4,
            paddingRight: 4,
          }}
          onClick={handleMenuToggle}
        />
      </div>
      <Menu ref={menu} model={menuItems} popup />

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

      {/* Диалог редактирования группы */}
      <EditGroupDialog
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        onSave={handleSaveEdit}
        data={data}
      />
    </div>
  );
};

export default ScreenGroupNode;
