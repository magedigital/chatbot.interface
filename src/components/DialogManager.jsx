import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import { updateNodeData } from "../store/nodesSlice";
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

  return (
    <>
      <EditScreenDialog
        visible={editScreenDialog !== null}
        onHide={handleHideEditGroupDialog}
        onSave={handleSaveEditGroupDialog}
        data={editScreenDialog}
        toastRef={toastRef}
      />

      <EditInnerNodeDialog
        visible={editInnerNodeDialog !== null}
        onHide={handleHideEditInnerNodeDialog}
        onSave={handleSaveEditInnerNodeDialog}
        data={editInnerNodeDialog}
        toastRef={toastRef}
      />

      <ConfirmDialog baseZIndex={UI.confirmDialogZIndex} />
    </>
  );
};

export default DialogManager;
