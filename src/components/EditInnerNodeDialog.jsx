import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { UI } from "../config/uiConfig";
import { removeEdge, addEdge } from "../store/nodesSlice";
import { Editor } from "primereact/editor";
import { Image } from "primereact/image";

import { Accordion, AccordionTab } from "primereact/accordion";
import ImageUpload from "./ImageUpload";

const EditInnerNodeDialog = ({ visible, onHide, onSave, data }) => {
  const dispatch = useDispatch();
  const allEdges = useSelector((state) => state.nodes.present.edges);
  const [label, setLabel] = useState(data?.data?.label || "");
  const [activeTab, setActiveTab] = useState(0);

  // Получаем все экраны из store (кроме стартового)
  const allScreens = useSelector((state) =>
    state.nodes.present.nodes.filter((node) => node.type === "screenGroupNode"),
  );

  // Создаем опции для выпадающих списков экранов
  const screenOptions = [
    { label: "Без перехода", value: "-" },
    ...allScreens.map((screen) => ({
      label: screen.data.label,
      value: screen.id,
    })),
  ];

  const [formData, setFormData] = useState({
    sendMessage: "",
    goToScreen: "-",
    openMiniApp: "-",
    command: "-",
    setUserStatus: "-",
    unsetUserStatus: "-",
    visibleForStatus: "-",
    hiddenForStatus: "-",
  });

  const [paramsList, setParamsList] = useState([]);

  // Обновляем состояние при изменении пропса data
  useEffect(() => {
    if (data && data.data) {
      // Находим связь, исходящую из этой ноды (если есть)
      const outgoingEdge = allEdges.find((edge) => edge.source === data.id);

      const targetScreenId = outgoingEdge ? outgoingEdge.target : "-";

      setLabel(data.data.label || "");
      setFormData({
        sendMessage: data.data.sendMessage || "",
        goToScreen: targetScreenId, // Устанавливаем в значение экрана, к которому ведет связь
        openMiniApp: data.data.openMiniApp || "-",
        command: data.data.command || "-",
        commandParam: data.data.commandParam || "-",
        commandValue: data.data.commandValue || "-",
        setUserStatus: data.data.setUserStatus || "-",
        unsetUserStatus: data.data.unsetUserStatus || "-",
        visibleForStatus: data.data.visibleForStatus || "-",
        hiddenForStatus: data.data.hiddenForStatus || "-",
      });
      setParamsList(data.data.paramsList || []);
    } else {
      setLabel("");
      setFormData({
        sendMessage: "",
        goToScreen: "-",
        openMiniApp: "-",
        command: "-",
        commandParam: "-",
        commandValue: "-",
        setUserStatus: "-",
        unsetUserStatus: "-",
        visibleForStatus: "-",
        hiddenForStatus: "-",
      });
      setParamsList([]);
    }
  }, [data, allEdges]);

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

    // Если была выбрана нода для перехода, управляем связями
    if (formData.goToScreen && formData.goToScreen !== "-") {
      // Удаляем все существующие связи от этой ноды
      const edgesToRemove = allEdges.filter((edge) => edge.source === data.id);
      edgesToRemove.forEach((edge) => {
        dispatch(removeEdge(edge.id));
      });

      // Создаем новую связь к выбранному экрану
      const newEdge = {
        id: `edge-${data.id}-${formData.goToScreen}`,
        source: data.id,
        target: formData.goToScreen,
        style: {
          strokeWidth: 3, // Устанавливаем толщину линии 3 пикселя
        },
        markerEnd: { type: "arrowclosed" },
        deletable: true,
        reconnectable: true,
        updatable: true,
      };

      dispatch(addEdge(newEdge));
    }

    onSave(updatedData);
    onHide();
  };

  const handleCancel = () => {
    onHide();
  };

  const handleUpload = (prop) => {
    // Создаем скрытый input для выбора файла
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Принимаем только изображения
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > UI.maxUploadSize) {
          alert(UI.fileSizeExceededMessage);
          return;
        }

        const reader = new FileReader();

        reader.onloadend = function () {
          setFormData({ ...formData, [prop]: reader.result });
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click(); // Открываем диалог выбора файла
  };

  const handleClearUpload = (prop) => {
    setFormData({ ...formData, [prop]: null });
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

  const miniAppOptions = [
    { label: "Не открывать", value: "-" },
    { label: "MiniApp 1", value: "MiniApp 1" },
    { label: "MiniApp 2", value: "MiniApp 2" },
    { label: "MiniApp 3", value: "MiniApp 3" },
    { label: "MiniApp 4", value: "MiniApp 4" },
    { label: "MiniApp 5", value: "MiniApp 5" },
  ];

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
      header="Редактировать кнопку"
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
          Название кнопки
        </label>
        <InputText
          id="buttonLabel"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="sendMessage" className="block font-bold mb-2">
          Сообщение после нажатия
        </label>
        <div className="flex flex-row gap-3">
          <div className="flex-grow-1">
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

          <div className="flex-none flex flex-column gap-3">
            <ImageUpload
              imageSrc={formData.sendImage}
              onUpload={handleUpload}
              onClear={handleClearUpload}
              uploadFieldName="sendImage"
            />
          </div>
        </div>
      </div>

      <Accordion
        activeIndex={
          formData.visibleForStatus != "-" || formData.hiddenForStatus != "-"
            ? 0
            : -1
        }
        className="mb-4"
      >
        <AccordionTab header="Видимость кнопки">
          <div className="w-full">
            <div className="field mb-3">
              <label
                htmlFor="visibleForStatus"
                className="block font-bold mb-2"
              >
                Видна для пользователя со статусом:
              </label>
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

          <div className="w-full">
            <div className="field mb-3">
              <label htmlFor="hiddenForStatus" className="block font-bold mb-2">
                Скрыта для пользователя со статусом:
              </label>
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
        </AccordionTab>
      </Accordion>
      <div className="field mb-3">
        <label className="block font-bold mb-2">Действия при нажатии:</label>
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
        >
          <TabPanel
            header={
              <div className="flex align-items-center gap-2">
                Перейти к другому экрану
                {formData.goToScreen !== "-" && <Badge severity="danger" />}
              </div>
            }
          >
            <div className="field mb-3">
              <label htmlFor="selectScreen" className="block font-bold mb-2">
                Выбрать экран
              </label>
              <Dropdown
                id="selectScreen"
                value={formData.goToScreen}
                options={screenOptions}
                onChange={(e) =>
                  setFormData({ ...formData, goToScreen: e.value })
                }
                className="w-full"
              />
            </div>
          </TabPanel>

          <TabPanel
            header={
              <div className="flex align-items-center gap-2">
                Открыть MiniApp
                {formData.openMiniApp !== "-" && <Badge severity="danger" />}
              </div>
            }
          >
            <div className="field mb-3">
              <label htmlFor="selectMiniApp" className="block font-bold mb-2">
                Выбрать MiniApp
              </label>
              <Dropdown
                id="selectMiniApp"
                value={formData.openMiniApp}
                options={miniAppOptions}
                onChange={(e) =>
                  setFormData({ ...formData, openMiniApp: e.value })
                }
                className="w-full"
              />
            </div>
          </TabPanel>

          <TabPanel
            header={
              <div className="flex align-items-center gap-2">
                Вызвать команду
                {formData.command !== "-" && <Badge severity="danger" />}
              </div>
            }
          >
            <div className="field mb-3">
              <label htmlFor="selectCommand" className="block font-bold mb-2">
                Выбрать команду
              </label>
              <Dropdown
                id="selectCommand"
                value={formData.command}
                options={commandOptions}
                onChange={(e) => setFormData({ ...formData, command: e.value })}
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
          </TabPanel>
        </TabView>
      </div>
    </Dialog>
  );
};

export default EditInnerNodeDialog;
