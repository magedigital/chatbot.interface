import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import { editScreenGroupNode, updateNodeData } from "../store/nodesSlice";
import EditGroupDialog from "./EditGroupDialog";

const DialogManager = () => {
  const dispatch = useDispatch();

  const handleSaveEditDialog = (data) => {
    dispatch(updateNodeData(data));
  };

  const handleHideEditDialog = () => {
    dispatch(editScreenGroupNode(false));
  };

  const { editDialog } = useSelector(
    (state) => ({
      editDialog: state.dialogs?.editDialog || null
    })
  );

  console.log("!!!!!", editDialog);

  return (
    <>
      <ConfirmDialog baseZIndex={1000001} />

      <EditGroupDialog
        visible={editDialog !== null}
        onHide={handleHideEditDialog}
        onSave={handleSaveEditDialog}
        data={editDialog}
      />
    </>
  );
};

export default DialogManager;
