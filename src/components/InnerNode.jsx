import React, { useCallback, useRef } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { NODE } from "../config/nodeConfig";
import { useDispatch } from "react-redux";
import { confirmDialog } from "primereact/confirmdialog";
import { editInnerNode, removeInnerNode } from "../store/nodesSlice";

// Компонент вложенной ноды с уникальным ID
const InnerNode = ({ data, id, parentNode, onDeleteNode }) => {
  const dispatch = useDispatch();
  const menu = useRef(null);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    menu.current.toggle(e);
  };

  const handleEdit = () => {
    dispatch(editInnerNode({ nodeId: id }));
  };

  const handleDelete = useCallback(() => {
    if (onDeleteNode) {
      onDeleteNode();
    } else {
      // Резервный вариант удаления, если onDeleteGroup не передан
      confirmDialog({
        message: "Вы действительно хотите удалить эту ноду?",
        header: "Подтверждение",
        icon: "pi pi-exclamation-triangle",
        acceptClassName: "p-button-danger",
        accept: () => {
          // Удаляем группу и все её дочерние ноды и соединения
          dispatch(removeInnerNode(id));
        },
        reject: () => {
          // Действие отменено, ничего не делаем
        },
      });
    }
  }, [id, dispatch, onDeleteNode]);

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
      disabled: data.isStartScreenNode,
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

      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <div
          style={{
            position: "relative",
            height: NODE.height,
            display: "flex",
            flex: 1,
            alignItems: "center",
            pointerEvents: "all",
          }}
          onDoubleClick={handleEdit}
        >
          <div
            style={{
              position: "relative",
              maxheight: NODE.height,
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              lineHeight: "120%",
              overflowWrap: "break-word",
              overflow: "hidden",
            }}
          >
            {data.label}
          </div>
        </div>
        <Button
          icon="pi pi-ellipsis-v"
          className="p-button-text p-button-plain"
          size="small"
          style={{
            width: "auto",
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 2,
            paddingRight: 2,
          }}
          onClick={handleMenuToggle}
        />
      </div>
      <Menu ref={menu} model={menuItems} popup />
    </div>
  );
};

export default InnerNode;
