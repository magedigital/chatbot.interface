import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { UI } from "../config/uiConfig";

const EditGroupDialog = ({ visible, onHide, onSave, data }) => {
  const [label, setLabel] = useState(data?.data?.label || "");

  // Обновляем состояние label при изменении пропса data
  useEffect(() => {
    if (data && data.data && data.data.label) {
      setLabel(data.data.label);
    } else {
      setLabel("");
    }
  }, [data]);

  const handleSave = () => {
    onSave({ ...data, data: { ...data.data, label } });
    onHide();
  };

  const handleCancel = () => {
    onHide();
  };

  const footer = (
    <div>
      <Button
        label={"Отмена"}
        icon="pi pi-times"
        onClick={handleCancel}
        className="p-button-secondary"
      />
      <Button
        label="Сохранить"
        icon="pi pi-check"
        onClick={handleSave}
        className="p-button-primary"
      />
    </div>
  );

  return (
    <Dialog
      header="Редактировать группу"
      visible={visible}
      onHide={onHide}
      footer={footer}
      style={{ width: "30vw" }}
      modal
      closable={true}
      baseZIndex={UI.editDialogZIndex}
    >
      <div className="field">
        <label htmlFor="groupName">Название группы</label>
        <InputText
          id="groupName"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
    </Dialog>
  );
};

export default EditGroupDialog;
