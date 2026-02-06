import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  editInnerNode,
  editScreenGroupNode,
  updateNodeData,
} from "../store/nodesSlice";
import EditScreenDialog from "./EditScreenDialog";
import EditInnerNodeDialog from "./EditInnerNodeDialog";
import { UI } from "../config/uiConfig";

const DialogManager = () => {
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
    editScreenDialog: state.nodes?.present?.dialogs?.editScreenDialog || null,
    editInnerNodeDialog: state.nodes?.present?.dialogs?.editInnerNodeDialog || null,
  }));

  return (
    <>
      <EditScreenDialog
        visible={editScreenDialog !== null}
        onHide={handleHideEditGroupDialog}
        onSave={handleSaveEditGroupDialog}
        data={editScreenDialog}
      />

      <EditInnerNodeDialog
        visible={editInnerNodeDialog !== null}
        onHide={handleHideEditInnerNodeDialog}
        onSave={handleSaveEditInnerNodeDialog}
        data={editInnerNodeDialog}
      />

      <ConfirmDialog baseZIndex={UI.confirmDialogZIndex} />
    </>
  );
};

export default DialogManager;
