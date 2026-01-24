import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { TextArea } from "primereact/textarea";

const EditInnerNodeDialog = ({ visible, onHide, onSave, data }) => {
  const [formData, setFormData] = useState({
    message: "Сообщение",
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
      setFormData({
        message: data.data.message || "Сообщение",
        sendMessage: data.data.sendMessage || "Пришлите сообщение",
        goToMode: data.data.goToMode || "Регистрация чека",
        miniApp: data.data.miniApp || "Регистрация кода",
        command: data.data.command || "Отправка ОС",
        commandParam: data.data.commandParam || "",
        commandValue: data.data.commandValue || "",
        showOnlyGroup: data.data.showOnlyGroup || "Загрузил чек",
        dontShowGroup: data.data.dontShowGroup || "Зарегистрировал код",
        addToGroup: data.data.addToGroup || "Загрузил чек",
        addRemoveFromGroup: data.data.addRemoveFromGroup || "Зарегистрировал код",
        deleteButton: data.data.deleteButton !== undefined ? data.data.deleteButton : true,
      });
      setParamsList(data.data.paramsList || []);
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
        paramsList
      }
    };
    onSave(updatedData);
    onHide();
  };

  const handleCancel = () => {
    // Восстанавливаем исходные значения при отмене
    if (data && data.data) {
      setFormData({
        message: data.data.message || "Сообщение",
        sendMessage: data.data.sendMessage || "Пришлите сообщение",
        goToMode: data.data.goToMode || "Регистрация чека",
        miniApp: data.data.miniApp || "Регистрация кода",
        command: data.data.command || "Отправка ОС",
        commandParam: data.data.commandParam || "",
        commandValue: data.data.commandValue || "",
        showOnlyGroup: data.data.showOnlyGroup || "Загрузил чек",
        dontShowGroup: data.data.dontShowGroup || "Зарегистрировал код",
        addToGroup: data.data.addToGroup || "Загрузил чек",
        addRemoveFromGroup: data.data.addRemoveFromGroup || "Зарегистрировал код",
        deleteButton: data.data.deleteButton !== undefined ? data.data.deleteButton : true,
      });
      setParamsList(data.data.paramsList || []);
    }
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
    <div>
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
    >
      <div className="form-field">
        <label htmlFor="message">Сообщение</label>
        <InputText
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="sendMessage">Пришлите сообщение</label>
        <TextArea
          id="sendMessage"
          value={formData.sendMessage}
          onChange={(e) => setFormData({...formData, sendMessage: e.target.value})}
          placeholder="Пришлите сообщение"
          rows={3}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="goToMode">Перейти в режим:</label>
        <Dropdown
          id="goToMode"
          value={formData.goToMode}
          options={goToModeOptions}
          onChange={(e) => setFormData({...formData, goToMode: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="miniApp">MiniApp:</label>
        <Dropdown
          id="miniApp"
          value={formData.miniApp}
          options={miniAppOptions}
          onChange={(e) => setFormData({...formData, miniApp: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="command">Команда</label>
        <Dropdown
          id="command"
          value={formData.command}
          options={commandOptions}
          onChange={(e) => setFormData({...formData, command: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label>Параметры команды</label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <InputText
            id="commandParam"
            value={formData.commandParam}
            onChange={(e) => setFormData({...formData, commandParam: e.target.value})}
            placeholder="Параметр"
            style={{ flex: 1 }}
          />
          <InputText
            id="commandValue"
            value={formData.commandValue}
            onChange={(e) => setFormData({...formData, commandValue: e.target.value})}
            placeholder="Значение"
            style={{ flex: 1 }}
          />
          <Button
            icon="pi pi-plus"
            onClick={handleParamAdd}
            className="p-button-outlined"
            style={{ minWidth: "auto" }}
          />
        </div>
      </div>

      {/* Список параметров команды */}
      {paramsList.map((param, index) => (
        <div key={index} className="form-field" style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <InputText
            value={param.param}
            onChange={(e) => handleParamChange(index, "param", e.target.value)}
            placeholder="Параметр"
            style={{ flex: 1 }}
          />
          <InputText
            value={param.value}
            onChange={(e) => handleParamChange(index, "value", e.target.value)}
            placeholder="Значение"
            style={{ flex: 1 }}
          />
          <Button
            icon="pi pi-times"
            onClick={() => handleParamRemove(index)}
            className="p-button-outlined p-button-danger"
            style={{ minWidth: "auto" }}
          />
        </div>
      ))}

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="showOnlyGroup">Показывать только группе:</label>
        <Dropdown
          id="showOnlyGroup"
          value={formData.showOnlyGroup}
          options={showOnlyGroupOptions}
          onChange={(e) => setFormData({...formData, showOnlyGroup: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="dontShowGroup">Не показывать группе:</label>
        <Dropdown
          id="dontShowGroup"
          value={formData.dontShowGroup}
          options={dontShowGroupOptions}
          onChange={(e) => setFormData({...formData, dontShowGroup: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="addToGroup">Добавить в группу:</label>
        <Dropdown
          id="addToGroup"
          value={formData.addToGroup}
          options={addToGroupOptions}
          onChange={(e) => setFormData({...formData, addToGroup: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="addRemoveFromGroup">Добавить убрать из группы:</label>
        <Dropdown
          id="addRemoveFromGroup"
          value={formData.addRemoveFromGroup}
          options={addRemoveFromGroupOptions}
          onChange={(e) => setFormData({...formData, addRemoveFromGroup: e.value})}
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-field" style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}>
        <Checkbox
          id="deleteButton"
          checked={formData.deleteButton}
          onChange={(e) => setFormData({...formData, deleteButton: e.checked})}
        />
        <label htmlFor="deleteButton" style={{ marginLeft: "0.5rem" }}>Удалить кнопку</label>
      </div>
    </Dialog>
  );
};

export default EditInnerNodeDialog;
