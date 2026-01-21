import React, { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { removeNode } from "../store/nodesSlice";
import { confirmDialog } from "primereact/confirmdialog";

// Обертка для ScreenGroupNode, которая передает обработчик удаления
const ScreenGroupNodeWrapper = ({ data, id, children, ...props }) => {
  const dispatch = useDispatch();
  const menu = useRef(null);
  const menuBtn = useRef(null);

  const handleDeleteGroup = useCallback(() => {
    confirmDialog({
      message: 'Вы действительно хотите удалить эту группу?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        // Удаляем группу и все её дочерние ноды
        dispatch(removeNode(id));
      },
      reject: () => {
        // Действие отменено, ничего не делаем
      }
    });
  }, [id, dispatch]);

  // Передаем обработчик удаления в компонент ScreenGroupNode
  return (
    <ScreenGroupNode 
      data={data} 
      id={id} 
      children={children}
      onDeleteGroup={handleDeleteGroup}
      menuRef={menu}
      menuBtnRef={menuBtn}
      {...props}
    />
  );
};

export default ScreenGroupNodeWrapper;