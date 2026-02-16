import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import { updateNodeData, removeEdge, addEdge } from "../store/nodesSlice";
import { editInnerNode, editScreenGroupNode } from "../store/editorSlice";
import EditScreenDialog from "./EditScreenDialog";
import EditInnerNodeDialog from "./EditInnerNodeDialog";
import { UI } from "../config/uiConfig";

const DialogManager = ({ toastRef }) => {
  const dispatch = useDispatch();

  const handleSaveEditGroupDialog = (data) => {
    dispatch(updateNodeData(data));
  };

  const handleHideEditGroupDialog = () => {
    dispatch(editScreenGroupNode(false));
  };

  const handleSaveEditInnerNodeDialog = (data) => {
    dispatch(updateNodeData(data));
  };

  const handleHideEditInnerNodeDialog = () => {
    dispatch(editInnerNode(false));
  };

  const { editScreenDialog, editInnerNodeDialog } = useSelector((state) => ({
    editScreenDialog: state.editor?.editScreenDialog || null,
    editInnerNodeDialog: state.editor?.editInnerNodeDialog || null,
  }));

  // Получаем данные из store для передачи в EditInnerNodeDialog
  const allEdges = useSelector((state) => state.nodes.present.edges);
  const allScreens = useSelector((state) =>
    state.nodes.present.nodes.filter((node) => node.type === "screenGroupNode"),
  );
  
  // Получаем опции из конфигурации
  const { commandOptions, miniAppOptions, userStatusOptions } = useSelector(
    (state) => state.config
  );

  // Функции для работы с ребрами
  const handleRemoveEdge = (edgeId) => {
    dispatch(removeEdge(edgeId));
  };

  const handleAddEdge = (newEdge) => {
    dispatch(addEdge(newEdge));
  };

  // Функции для работы с загрузкой изображений
  const handleUpdateNodeData = (nodeData) => {
    dispatch(updateNodeData(nodeData));
  };

  return (
    <>
      <EditScreenDialog
        visible={editScreenDialog !== null}
        onHide={handleHideEditGroupDialog}
        onSave={handleSaveEditGroupDialog}
        data={editScreenDialog}
        toastRef={toastRef}
        commandOptions={commandOptions}
        userStatusOptions={userStatusOptions}
      />

      <EditInnerNodeDialog
        visible={editInnerNodeDialog !== null}
        onHide={handleHideEditInnerNodeDialog}
        onSave={handleSaveEditInnerNodeDialog}
        data={editInnerNodeDialog}
        toastRef={toastRef}
        allEdges={allEdges}
        allScreens={allScreens}
        onRemoveEdge={handleRemoveEdge}
        onAddEdge={handleAddEdge}
        onUpdateNodeData={handleUpdateNodeData}
        commandOptions={commandOptions}
        miniAppOptions={miniAppOptions}
        userStatusOptions={userStatusOptions}
      />

      <ConfirmDialog baseZIndex={UI.confirmDialogZIndex} />
    </>
  );
};

export default DialogManager;
