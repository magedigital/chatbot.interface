import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { UI } from "../config/uiConfig";
import { Fieldset } from "primereact/fieldset";

import { Editor } from "primereact/editor";

const EditScreenDialog = ({ visible, onHide, onSave, data }) => {
  const [label, setLabel] = useState(data?.data?.label || "");
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    sendMessage: "",
    defaultMessage: "",
    command: "-",
    setUserStatus: "-",
    unsetUserStatus: "-",
  });

  const [paramsList, setParamsList] = useState([]);

  // Обновляем состояние при изменении пропса data
  useEffect(() => {
    if (data && data.data) {
      setLabel(data.data.label || "");
      setFormData({
        sendMessage: data.data.sendMessage || "",
        defaultMessage: data.data.defaultMessage || "",
        command: data.data.command || "-",
        commandParam: data.data.commandParam || "-",
        commandValue: data.data.commandValue || "-",
        setUserStatus: data.data.setUserStatus || "-",
        unsetUserStatus: data.data.unsetUserStatus || "-",
      });
      setParamsList(data.data.paramsList || []);
    } else {
      setLabel("");
      setFormData({
        sendMessage: "",
        defaultMessage: "",
        command: "-",
        commandParam: "-",
        commandValue: "-",
        setUserStatus: "-",
        unsetUserStatus: "-",
      });
      setParamsList([]);
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
  const commandOptions = [
    { label: "Без команды", value: "-" },
    { label: "Команда 1", value: "Команда 1" },
    { label: "Команда 2", value: "Команда 2" },
    { label: "Команда 3", value: "Команда 3" },
    { label: "Команда 4", value: "Команда 4" },
    { label: "Команда 5", value: "Команда 5" },
  ];

  // Опции для выпадающих списков
  const userStatusOptions = [
    { label: "Без изменений", value: "-" },
    { label: "Заполнил данные", value: "Заполнил данные" },
    { label: "Загрузил чек", value: "Загрузил чек" },
    { label: "Зарегистрировал код", value: "Зарегистрировал код" },
  ];

  const footer = (
    <div className="flex justify-content-end gap-2 flex-column sm:flex-row mt-4">
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

  const header = (
    <div id="toolbar">
      <button className="ql-bold" aria-label=":Жирный"></button>
      <button className="ql-italic" aria-label="Наклонный"></button>
      <button className="ql-underline" aria-label="Подчеркнутый"></button>
      <button className="ql-strike" aria-label="Зачеркнутый"></button>
      <button className="ql-blockquote" aria-label="Цитата"></button>
      <button className="ql-link" aria-label="Ссылка"></button>
    </div>
  );

  return (
    <Dialog
      header="Редактировать экран"
      visible={visible}
      onHide={onHide}
      footer={footer}
      className="w-screen"
      style={{ maxWidth: "45rem" }}
      modal
      closable={true}
      baseZIndex={UI.editDialogZIndex}
    >
      <div className="field mb-3">
        <label htmlFor="buttonLabel" className="block font-bold mb-2">
          Название экрана
        </label>
        <InputText
          id="buttonLabel"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="message" className="block font-bold mb-2">
          Сообщение при входе в экран
        </label>
        <Editor
          id="message"
          value={formData.sendMessage}
          onTextChange={(e) =>
            setFormData({ ...formData, sendMessage: e.htmlValue })
          }
          className="w-full"
          theme="snow"
          style={{ height: "320px" }}
          headerTemplate={header}
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
        />
      </div>

      <Fieldset legend="Реакция по умолчанию">
        <div className="field mb-3">
          <div className="field mb-3">
            <label htmlFor="defaultMessage" className="block font-bold mb-2">
              Сообщение
            </label>

            <Editor
              id="defaultMessage"
              value={formData.defaultMessage}
              onTextChange={(e) =>
                setFormData({ ...formData, defaultMessage: e.htmlValue })
              }
              className="w-full"
              theme="snow"
              style={{ height: "320px" }}
              headerTemplate={header}
              modules={{
                clipboard: {
                  matchVisual: false,
                },
              }}
            />
          </div>

          {data?.data && !data?.data?.isStartScreen && (
            <>
              <div className="field mb-3">
                <label htmlFor="selectCommand" className="block font-bold mb-2">
                  Выбрать команду
                </label>
                <Dropdown
                  id="selectCommand"
                  value={formData.command}
                  options={commandOptions}
                  onChange={(e) =>
                    setFormData({ ...formData, command: e.value })
                  }
                  className="w-full"
                />
              </div>
              {formData.command !== "-" && (
                <>
                  <div className="field mb-3">
                    <label
                      htmlFor="setUserStatus"
                      className="block font-bold mb-2"
                    >
                      Параметры команды:
                    </label>
                    {/* Список параметров команды */}
                    {paramsList.map((param, index) => (
                      <div
                        key={index}
                        className="field flex flex-row align-items-center gap-2"
                      >
                        <div className="w-full flex flex-column md:flex-row align-items-start md:align-items-center gap-2">
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
                  </div>
                  <div className="w-full mt-4">
                    <div className="field mb-3">
                      <label
                        htmlFor="setUserStatus"
                        className="block font-bold mb-2"
                      >
                        Установить статус пользователя:
                      </label>
                      <Dropdown
                        id="setUserStatus"
                        value={formData.setUserStatus}
                        options={userStatusOptions}
                        onChange={(e) =>
                          setFormData({ ...formData, setUserStatus: e.value })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="field mb-3">
                      <label
                        htmlFor="unsetUserStatus"
                        className="block font-bold mb-2"
                      >
                        Снять статус пользователя:
                      </label>
                      <Dropdown
                        id="unsetUserStatus"
                        value={formData.unsetUserStatus}
                        options={userStatusOptions}
                        onChange={(e) =>
                          setFormData({ ...formData, unsetUserStatus: e.value })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Fieldset>
    </Dialog>
  );
};

export default EditScreenDialog;
