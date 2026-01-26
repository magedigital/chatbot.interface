import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import { UI } from "../config/uiConfig";

const EditInnerNodeDialog = ({ visible, onHide, onSave, data }) => {
  const [label, setLabel] = useState(data?.data?.label || "");
  const [formData, setFormData] = useState({
    sendMessage: "Пришлите сообщение",
    goToMode: "Регистрация чека",
    miniApp: "Регистрация кода",
    command: "Отправка ОС",
    commandParam: "",
    commandValue: "",
    showOnlyGroup: "Загрузил чек",
    dontShowGroup: "Зарегистрировал код",
    addToGroup: "Загрузил чек",
    addRemoveFromGroup: "Зарегистрировал код",
    deleteButton: true,
  });

  const [paramsList, setParamsList] = useState([]);

  // Обновляем состояние при изменении пропса data
  useEffect(() => {
    if (data && data.data) {
      setLabel(data.data.label);
      setFormData({
        sendMessage: data.data.sendMessage || "Пришлите сообщение",
        goToMode: data.data.goToMode || "Регистрация чека",
        miniApp: data.data.miniApp || "Регистрация кода",
        command: data.data.command || "Отправка ОС",
        commandParam: data.data.commandParam || "",
        commandValue: data.data.commandValue || "",
        showOnlyGroup: data.data.showOnlyGroup || "Загрузил чек",
        dontShowGroup: data.data.dontShowGroup || "Зарегистрировал код",
        addToGroup: data.data.addToGroup || "Загрузил чек",
        addRemoveFromGroup:
          data.data.addRemoveFromGroup || "Зарегистрировал код",
        deleteButton:
          data.data.deleteButton !== undefined ? data.data.deleteButton : true,
      });
      setParamsList(data.data.paramsList || []);
    } else {
      setLabel("");
    }
  }, [data]);

  const handleParamAdd = () => {
    setParamsList([...paramsList, { param: "", value: "" }]);
  };

  const handleParamChange = (index, field, value) => {
    const updatedParams = [...paramsList];
    updatedParams[index][field] = value;
    setParamsList(updatedParams);
  };

  const handleParamRemove = (index) => {
    const updatedParams = [...paramsList];
    updatedParams.splice(index, 1);
    setParamsList(updatedParams);
  };

  const handleSave = () => {
    const updatedData = {
      ...data,
      data: {
        ...data.data,
        ...formData,
        paramsList,
        label,
      },
    };
    onSave(updatedData);
    onHide();
  };

  const handleCancel = () => {
    onHide();
  };

  // Опции для выпадающих списков
  const goToModeOptions = [
    { label: "Регистрация чека", value: "Регистрация чека" },
    { label: "Другой режим", value: "Другой режим" },
  ];

  const miniAppOptions = [
    { label: "Регистрация кода", value: "Регистрация кода" },
    { label: "Другой MiniApp", value: "Другой MiniApp" },
  ];

  const commandOptions = [
    { label: "Отправка ОС", value: "Отправка ОС" },
    { label: "Другая команда", value: "Другая команда" },
  ];

  const showOnlyGroupOptions = [
    { label: "Загрузил чек", value: "Загрузил чек" },
    { label: "Другая группа", value: "Другая группа" },
  ];

  const dontShowGroupOptions = [
    { label: "Зарегистрировал код", value: "Зарегистрировал код" },
    { label: "Другая группа", value: "Другая группа" },
  ];

  const addToGroupOptions = [
    { label: "Загрузил чек", value: "Загрузил чек" },
    { label: "Другая группа", value: "Другая группа" },
  ];

  const addRemoveFromGroupOptions = [
    { label: "Зарегистрировал код", value: "Зарегистрировал код" },
    { label: "Другая группа", value: "Другая группа" },
  ];

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Отмена"
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
      header="Редактировать внутреннюю ноду"
      visible={visible}
      onHide={onHide}
      footer={footer}
      style={{ width: "50vw" }}
      modal
      closable={true}
      baseZIndex={UI.editDialogZIndex}
    >
      <div className="field mb-3">
        <label htmlFor="groupName" className="block font-bold mb-2">
          Название ноды
        </label>
        <InputText
          id="groupName"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="sendMessage" className="block font-bold mb-2">
          Сообщение
        </label>
        <InputTextarea
          id="sendMessage"
          value={formData.sendMessage}
          onChange={(e) =>
            setFormData({ ...formData, sendMessage: e.target.value })
          }
          placeholder="Пришлите сообщение"
          rows={3}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="goToMode" className="block font-bold mb-2">
          Перейти в режим:
        </label>
        <Dropdown
          id="goToMode"
          value={formData.goToMode}
          options={goToModeOptions}
          onChange={(e) => setFormData({ ...formData, goToMode: e.value })}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="miniApp" className="block font-bold mb-2">
          MiniApp:
        </label>
        <Dropdown
          id="miniApp"
          value={formData.miniApp}
          options={miniAppOptions}
          onChange={(e) => setFormData({ ...formData, miniApp: e.value })}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="command" className="block font-bold mb-2">
          Команда
        </label>
        <Dropdown
          id="command"
          value={formData.command}
          options={commandOptions}
          onChange={(e) => setFormData({ ...formData, command: e.value })}
          className="w-full"
        />
      </div>

      <Fieldset legend="Параметры команды">
        {/* Список параметров команды */}
        {paramsList.map((param, index) => (
          <div
            key={index}
            className="field flex flex-row align-items-center gap-2"
          >
            <div className="w-full flex flex-column lg:flex-row align-items-start lg:align-items-center gap-2">
              <InputText
                value={param.param}
                onChange={(e) =>
                  handleParamChange(index, "param", e.target.value)
                }
                placeholder="Параметр"
                className="w-full flex-1"
              />
              <InputText
                value={param.value}
                onChange={(e) =>
                  handleParamChange(index, "value", e.target.value)
                }
                placeholder="Значение"
                className="w-full flex-1"
              />
            </div>
            <Button
              icon="pi pi-times"
              onClick={() => handleParamRemove(index)}
              className="p-button-outlined p-button-danger flex-none"
            />
          </div>
        ))}
        <Button
          icon="pi pi-plus"
          onClick={handleParamAdd}
          className="p-button-outlined w-full"
        />
      </Fieldset>

      <div className="field w-full mt-2">
        <div className="w-full flex flex-column lg:flex-row align-items-start lg:align-items-center gap-2">
          <div className="field flex-1 w-full mb-3">
            <label
              htmlFor="showOnlyGroup"
              className="block w-full font-bold mb-2"
            >
              Показывать только группе:
            </label>
            <Dropdown
              id="showOnlyGroup"
              value={formData.showOnlyGroup}
              options={showOnlyGroupOptions}
              onChange={(e) =>
                setFormData({ ...formData, showOnlyGroup: e.value })
              }
              className="w-full"
            />
          </div>

          <div className="field flex-1 w-full mb-3">
            <label htmlFor="dontShowGroup" className="block font-bold mb-2">
              Не показывать группе:
            </label>
            <Dropdown
              id="dontShowGroup"
              value={formData.dontShowGroup}
              options={dontShowGroupOptions}
              onChange={(e) =>
                setFormData({ ...formData, dontShowGroup: e.value })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="field w-full mt-2">
        <div className="w-full flex flex-column lg:flex-row align-items-start lg:align-items-center gap-2">
          <div className="field flex-1 w-full mb-3">
            <label htmlFor="addToGroup" className="block font-bold mb-2">
              Добавить в группу:
            </label>
            <Dropdown
              id="addToGroup"
              value={formData.addToGroup}
              options={addToGroupOptions}
              onChange={(e) =>
                setFormData({ ...formData, addToGroup: e.value })
              }
              className="w-full"
            />
          </div>

          <div className="field flex-1 w-full mb-3">
            <label
              htmlFor="addRemoveFromGroup"
              className="block font-bold mb-2"
            >
              Добавить убрать из группы:
            </label>
            <Dropdown
              id="addRemoveFromGroup"
              value={formData.addRemoveFromGroup}
              options={addRemoveFromGroupOptions}
              onChange={(e) =>
                setFormData({ ...formData, addRemoveFromGroup: e.value })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditInnerNodeDialog;
