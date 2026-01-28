import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { UI } from "../config/uiConfig";

const EditInnerNodeDialog = ({ visible, onHide, onSave, data }) => {
  const [label, setLabel] = useState(data?.data?.label || "");
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState({
    sendMessage: "Пришлите сообщение",
    goToScreen: "Экран 1",
    openMiniApp: "MiniApp 1",
    command: "",
    commandParam: "",
    commandValue: "",
    setUserStatus: "Заполнил данные",
    unsetUserStatus: "Заполнил данные",
    visibleForStatus: "Заполнил данные",
    hiddenForStatus: "Заполнил данные",
  });

  const [paramsList, setParamsList] = useState([]);

  // Обновляем состояние при изменении пропса data
  useEffect(() => {
    if (data && data.data) {
      setLabel(data.data.label || "");
      setFormData({
        sendMessage: data.data.sendMessage || "Пришлите сообщение",
        goToScreen: data.data.goToScreen || "Экран 1",
        openMiniApp: data.data.openMiniApp || "MiniApp 1",
        command: data.data.command || "",
        commandParam: data.data.commandParam || "",
        commandValue: data.data.commandValue || "",
        setUserStatus: data.data.setUserStatus || "Заполнил данные",
        unsetUserStatus: data.data.unsetUserStatus || "Заполнил данные",
        visibleForStatus: data.data.visibleForStatus || "Заполнил данные",
        hiddenForStatus: data.data.hiddenForStatus || "Заполнил данные",
      });
      setParamsList(data.data.paramsList || []);
    } else {
      setLabel("");
      setFormData({
        sendMessage: "Пришлите сообщение",
        goToScreen: "Экран 1",
        openMiniApp: "MiniApp 1",
        command: "",
        commandParam: "",
        commandValue: "",
        setUserStatus: "Заполнил данные",
        unsetUserStatus: "Заполнил данные",
        visibleForStatus: "Заполнил данные",
        hiddenForStatus: "Заполнил данные",
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
  const screenOptions = [
    { label: "Экран 1", value: "Экран 1" },
    { label: "Экран 2", value: "Экран 2" },
    { label: "Экран 3", value: "Экран 3" },
    { label: "Экран 4", value: "Экран 4" },
    { label: "Экран 5", value: "Экран 5" },
  ];

  const miniAppOptions = [
    { label: "MiniApp 1", value: "MiniApp 1" },
    { label: "MiniApp 2", value: "MiniApp 2" },
    { label: "MiniApp 3", value: "MiniApp 3" },
    { label: "MiniApp 4", value: "MiniApp 4" },
    { label: "MiniApp 5", value: "MiniApp 5" },
  ];

  const userStatusOptions = [
    { label: "Заполнил данные", value: "Заполнил данные" },
    { label: "Загрузил чек", value: "Загрузил чек" },
    { label: "Зарегистрировал код", value: "Зарегистрировал код" },
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
        <label htmlFor="buttonLabel" className="block font-bold mb-2">Название кнопки</label>
        <InputText
          id="buttonLabel"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="message" className="block font-bold mb-2">Сообщение после нажатия</label>
        <InputTextarea
          id="message"
          value={formData.sendMessage}
          onChange={(e) =>
            setFormData({ ...formData, sendMessage: e.target.value })
          }
          placeholder="Сообщение"
          rows={3}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          <TabPanel header="Перейти к другому экрану">
            <div className="field mb-3">
              <label htmlFor="selectScreen" className="block font-bold mb-2">Выбрать экран</label>
              <Dropdown
                id="selectScreen"
                value={formData.goToScreen}
                options={screenOptions}
                onChange={(e) => setFormData({ ...formData, goToScreen: e.value })}
                className="w-full"
              />
            </div>
          </TabPanel>

          <TabPanel header="Открыть MiniApp">
            <div className="field mb-3">
              <label htmlFor="selectMiniApp" className="block font-bold mb-2">Выбрать MiniApp</label>
              <Dropdown
                id="selectMiniApp"
                value={formData.openMiniApp}
                options={miniAppOptions}
                onChange={(e) => setFormData({ ...formData, openMiniApp: e.value })}
                className="w-full"
              />
            </div>
          </TabPanel>

          <TabPanel header="Вызвать команду">
            <div className="field mb-3">
              <label htmlFor="command" className="block font-bold mb-2">Команда</label>
              <InputText
                id="command"
                value={formData.command}
                onChange={(e) =>
                  setFormData({ ...formData, command: e.target.value })
                }
                placeholder="Команда"
                className="w-full"
              />
            </div>

            <div className="field mb-2">
              <div className="flex flex-column sm:flex-row align-items-start sm:align-items-center gap-2">
                <InputText
                  id="commandParam"
                  value={formData.commandParam}
                  onChange={(e) =>
                    setFormData({ ...formData, commandParam: e.target.value })
                  }
                  placeholder="Параметр"
                  className="w-full sm:w-auto flex-1"
                />
                <InputText
                  id="commandValue"
                  value={formData.commandValue}
                  onChange={(e) =>
                    setFormData({ ...formData, commandValue: e.target.value })
                  }
                  placeholder="Значение"
                  className="w-full sm:w-auto flex-1"
                />
                <Button
                  icon="pi pi-plus"
                  onClick={handleParamAdd}
                  className="p-button-outlined"
                />
              </div>
            </div>

            {/* Список параметров команды */}
            {paramsList.map((param, index) => (
              <div
                key={index}
                className="field mb-2 flex flex-column sm:flex-row align-items-start sm:align-items-center gap-2"
              >
                <InputText
                  value={param.param}
                  onChange={(e) =>
                    handleParamChange(index, "param", e.target.value)
                  }
                  placeholder="Параметр"
                  className="w-full sm:w-auto flex-1"
                />
                <InputText
                  value={param.value}
                  onChange={(e) =>
                    handleParamChange(index, "value", e.target.value)
                  }
                  placeholder="Значение"
                  className="w-full sm:w-auto flex-1"
                />
                <Button
                  icon="pi pi-times"
                  onClick={() => handleParamRemove(index)}
                  className="p-button-outlined p-button-danger"
                />
              </div>
            ))}

            <div className="grid mt-2">
              <div className="col-6">
                <div className="field mb-3">
                  <label htmlFor="setUserStatus" className="block font-bold mb-2">Установить статус пользователя:</label>
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

              <div className="col-6">
                <div className="field mb-3">
                  <label htmlFor="unsetUserStatus" className="block font-bold mb-2">Снять статус пользователя:</label>
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
            </div>
          </TabPanel>
        </TabView>
      </div>

      <div className="grid mt-2">
        <div className="col-6">
          <div className="field mb-3">
            <label htmlFor="visibleForStatus" className="block font-bold mb-2">Видна для пользователя со статусом:</label>
            <Dropdown
              id="visibleForStatus"
              value={formData.visibleForStatus}
              options={userStatusOptions}
              onChange={(e) =>
                setFormData({ ...formData, visibleForStatus: e.value })
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="col-6">
          <div className="field mb-3">
            <label htmlFor="hiddenForStatus" className="block font-bold mb-2">Скрыта для пользователя со статусом:</label>
            <Dropdown
              id="hiddenForStatus"
              value={formData.hiddenForStatus}
              options={userStatusOptions}
              onChange={(e) =>
                setFormData({ ...formData, hiddenForStatus: e.value })
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