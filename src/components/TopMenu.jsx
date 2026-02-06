import React, { useCallback, useRef } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { UI } from "../config/uiConfig.js";
import { useSelector, useDispatch } from "react-redux";
import { setNodes, setEdges, clearAllScreenGroups } from "../store/nodesSlice";
import {
  exportAppData,
  saveDataToFile,
  readDataFromFile,
  sendDataToServer,
} from "../utils/dataUtils";
import { store } from "../store/store.js";
import { Toast } from "primereact/toast";

const TopMenu = ({ reactFlowRef, toastRef }) => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.nodes);

  // Функция для добавления новой группы экрана
  const handleAddScreen = useCallback(() => {
    if (reactFlowRef.current && reactFlowRef.current.addScreenAndNavigate) {
      reactFlowRef.current.addScreenAndNavigate();
    }
  }, [reactFlowRef]);

  // Функция для экспорта данных приложения
  const handleExportData = useCallback(() => {
    // Подготовка данных для экспорта
    const exportData = exportAppData(nodes, edges);

    // Сохранение данных в файл
    saveDataToFile(exportData, "bot-construct-data.json");
  }, [nodes, edges]);

  // Функция для импорта данных приложения
  const handleImportData = useCallback(() => {
    confirmDialog({
      message:
        "Вы действительно хотите импортировать данные? Это заменит текущие ноды и связи.",
      header: "Подтверждение импорта",
      icon: "pi pi-download",
      acceptClassName: "p-button-danger",
      accept: () => {
        // Создаем скрытый input для выбора файла
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            readDataFromFile(
              file,
              (data) => {
                // Загружаем данные в состояние Redux
                if (data.nodes) {
                  dispatch(setNodes(data.nodes));
                }
                if (data.edges) {
                  dispatch(setEdges(data.edges));
                }

                // Показываем уведомление об успешной загрузке
                toastRef.current.show({
                  severity: "success",
                  summary: "Успешно",
                  detail: "Данные успешно загружены из файла!",
                  life: 3000,
                });
              },
              (error) => {
                console.error("Ошибка при чтении файла:", error);
                toastRef.current.show({
                  severity: "error",
                  summary: "Ошибка",
                  detail:
                    "Произошла ошибка при чтении файла. Пожалуйста, проверьте формат файла.",
                  life: 3000,
                });
              },
            );
          }
        };
        fileInput.click();
      },
      reject: () => {
        // Действие отменено, ничего не делаем
      },
    });
  }, [dispatch, toastRef]);

  // Функция для очистки всех групп
  const handleClearAllGroups = useCallback(() => {
    confirmDialog({
      message: "Вы действительно хотите удалить все группы?",
      header: "Подтверждение",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        // Вызываем Redux действие для очистки всех групп экранов
        dispatch(clearAllScreenGroups());
      },
      reject: () => {
        // Действие отменено, ничего не делаем
      },
    });
  }, [dispatch]);

  // Функция для автоматического вертикального размещения нод с использованием ELK
  const handleLayoutVertical = useCallback(() => {
    if (reactFlowRef.current && reactFlowRef.current.layout) {
      reactFlowRef.current.layout(nodes, edges, { "elk.direction": "DOWN" });
    }
  }, [nodes, edges, reactFlowRef]);

  // Функция для автоматического горизонтального размещения нод с использованием ELK
  const handleLayoutHorizontal = useCallback(() => {
    if (reactFlowRef.current && reactFlowRef.current.layout) {
      reactFlowRef.current.layout(nodes, edges, { "elk.direction": "RIGHT" });
    }
  }, [nodes, edges, reactFlowRef]);

  // Функция для автоматического размещения нод по алгоритму rectpacking
  const handleLayoutRectPacking = useCallback(() => {
    if (reactFlowRef.current && reactFlowRef.current.layout) {
      reactFlowRef.current.layout(nodes, edges, {
        "elk.algorithm": "rectpacking",
      });
    }
  }, [nodes, edges, reactFlowRef]);

  // Функция для сохранения данных на сервер
  const handleSaveData = useCallback(async () => {
    try {
      // Получаем конфигурацию из store
      const configState = store.getState().config;

      // Подготовка данных для отправки
      const dataToSend = exportAppData(nodes, edges);

      // Отправка данных на сервер
      const response = await sendDataToServer(configState.saveUrl, dataToSend);

      console.log("Данные успешно сохранены:", response.data);
      toastRef.current.show({
        severity: "success",
        summary: "Успешно",
        detail: "Данные успешно сохранены на сервере!",
        life: 3000,
      });
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Произошла ошибка при сохранении данных на сервере.",
        life: 3000,
      });
    }
  }, [nodes, edges, toastRef]);

  // Функция для публикации данных на сервер
  const handlePublishData = useCallback(async () => {
    confirmDialog({
      message:
        "Вы действительно хотите опубликовать данные? Это заменит текущие данные на сервере.",
      header: "Подтверждение публикации",
      icon: "pi pi-cloud-upload",
      acceptClassName: "p-button-warning",
      accept: async () => {
        try {
          // Получаем конфигурацию из store
          const configState = store.getState().config;

          // Подготовка данных для отправки
          const dataToSend = exportAppData(nodes, edges);

          // Отправка данных на сервер
          const response = await sendDataToServer(
            configState.publishUrl,
            dataToSend,
          );

          console.log("Данные успешно опубликованы:", response.data);
          toastRef.current.show({
            severity: "success",
            summary: "Успешно",
            detail: "Данные успешно опубликованы на сервере!",
            life: 3000,
          });
        } catch (error) {
          console.error("Ошибка при публикации данных:", error);
          toastRef.current.show({
            severity: "error",
            summary: "Ошибка",
            detail: "Произошла ошибка при публикации данных на сервере.",
            life: 3000,
          });
        }
      },
      reject: () => {
        // Действие отменено, ничего не делаем
      },
    });
  }, [nodes, edges, toastRef]);

  return (
    <Menubar
      className="absolute w-full shadow-4 min-w-max"
      style={{ zIndex: UI.topMenuZIndex, height: UI.topMenuHeight }}
      model={[
        {
          label: "Добавить экран",
          icon: "pi pi-plus",
          command: () => handleAddScreen(),
        },
        {
          label: "Флоу",
          icon: "pi pi-file-export",
          items: [
            {
              label: "Экспорт",
              icon: "pi pi-upload",
              command: () => handleExportData(),
            },
            {
              label: "Импорт",
              icon: "pi pi-download",
              command: () => handleImportData(),
            },
            {
              separator: true,
            },
            {
              label: "Очистить",
              icon: "pi pi-trash",
              command: () => handleClearAllGroups(),
            },
          ],
        },
        {
          label: "Расположить",
          icon: "pi pi-sort-alt",
          items: [
            {
              label: "Вертикально",
              icon: "pi pi-sort-alt",
              command: () => handleLayoutVertical(),
            },
            {
              label: "Горизонтально",
              icon: "pi pi-arrow-right-arrow-left",
              command: () => handleLayoutHorizontal(),
            },
            {
              label: "По порядку",
              icon: "pi pi-th-large",
              command: () => handleLayoutRectPacking(),
            },
          ],
        },
      ]}
      end={
        <ButtonGroup>
          <Button
            onClick={() => handleSaveData()}
            size="small"
            icon="pi pi-save"
            severity="primary"
            aria-label="Сохранить"
          >
            <span className="p-button-text hidden sm:inline ml-2">
              Сохранить
            </span>
          </Button>
          <Button
            onClick={() => handlePublishData()}
            size="small"
            icon="pi pi-cloud-upload"
            severity="contrast"
            aria-label="Опубликовать"
          >
            <span className="hidden sm:inline ml-2 font-bold">
              Опубликовать
            </span>
          </Button>
        </ButtonGroup>
      }
    />
  );
};

export default TopMenu;
