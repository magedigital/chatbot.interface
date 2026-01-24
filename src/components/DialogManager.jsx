import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  editInnerNode,
  editScreenGroupNode,
  updateNodeData,
} from "../store/nodesSlice";
import EditGroupDialog from "./EditGroupDialog";
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

  const { editGroupDialog, editInnerNodeDialog } = useSelector((state) => ({
    editGroupDialog: state.nodes?.dialogs?.editGroupDialog || null,
    editInnerNodeDialog: state.nodes?.dialogs?.editInnerNodeDialog || null,
  }));

  return (
    <>
      <EditGroupDialog
        visible={editGroupDialog !== null}
        onHide={handleHideEditGroupDialog}
        onSave={handleSaveEditGroupDialog}
        data={editGroupDialog}
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
