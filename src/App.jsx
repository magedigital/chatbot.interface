import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store } from "./store/store.js";
import { ReactFlowProvider } from "reactflow";
import ReactFlowComponent from "./components/ReactFlowComponent";

import { Toast } from "primereact/toast";
import {
  setNodes,
  setEdges,
  addEdge as addEdgeAction,
  updateNode,
  updateNodePositionsInGroup,
  removeEdge,
  clearAllScreenGroups,
} from "./store/nodesSlice";
import { updateConfig } from "./store/configSlice";
import {
  exportAppData,
  saveDataToFile,
  readDataFromFile,
  sendDataToServer,
} from "./utils/dataUtils";
import "reactflow/dist/style.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
// import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./css/quill-editor-custom-styles.css";

import { confirmDialog } from "primereact/confirmdialog";
import { addLocale, PrimeReactProvider } from "primereact/api";

import InnerNode from "./components/InnerNode";
import ScreenGroupNode from "./components/ScreenGroupNode";
import TopPanel from "./components/TopPanel";
import DialogManager from "./components/DialogManager";

import * as locales from "./locales/ru.json";

const initialNodes = [];
const initialEdges = [];

function App() {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const reactFlowRef = useRef(null);
  const { nodes, edges } = useSelector((state) => state.nodes);

  // Инициализация начальных данных
  useEffect(() => {
    dispatch(setNodes(initialNodes));
    dispatch(setEdges(initialEdges));
    addLocale("ru", locales["ru"]);

    // Загрузка конфигурации из глобального объекта
    if (window.config) {
      dispatch(updateConfig(window.config));
    }
  }, [dispatch]);

  // Регистрация пользовательских типов нод
  const nodeTypes = useMemo(
    () => ({
      innerNode: InnerNode,
      screenGroupNode: ScreenGroupNode,
    }),
    [],
  );

  const onConnect = useCallback(
    (params) => {
      // Проверяем, есть ли уже соединение от этого источника
      const existingEdge = edges.find((edge) => edge.source === params.source);
      if (existingEdge) {
        // Если есть, удаляем старое соединение
        dispatch(removeEdge(existingEdge.id));
      }

      // Создаем новое соединение
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        style: {
          strokeWidth: 3, // Устанавливаем толщину линии 3 пикселя
        },
        markerEnd: { type: "arrowclosed" },
        deletable: true,
        reconnectable: true,
        updatable: true,
      };

      dispatch(addEdgeAction(newEdge));
    },
    [dispatch, edges],
  );

  // Ограничение перемещения нод внутри их групп и автоматическое вертикальное упорядочивание
  const onNodeDragStop = useCallback(
    (event, node) => {
      // Используем Redux действие для обновления позиций нод в группе
      dispatch(updateNodePositionsInGroup({ node }));
    },
    [dispatch],
  );

  // Обработчик начала перетаскивания ноды - устанавливаем z-index для отображения поверх других нод
  const onNodeDragStart = useCallback(
    (event, node) => {
      // Находим максимальный z-index среди всех нод
      const maxZIndex = nodes.reduce((max, n) => {
        const zIndex = n.zIndex || 0;
        return zIndex > max ? zIndex : max;
      }, 0);

      // Если это групповая нода (имеет дочерние ноды), поднимаем её и все её внутренние ноды на передний план
      const childNodes = nodes.filter((n) => n.parentNode === node.id);
      if (childNodes.length > 0) {
        // Обновляем z-index для групповой ноды
        const updatedGroupNode = {
          ...node,
          zIndex: maxZIndex + 1,
        };
        dispatch(updateNode(updatedGroupNode));

        // Обновляем z-index для всех внутренних нод группы
        childNodes.forEach((childNode) => {
          const updatedChildNode = {
            ...childNode,
            zIndex: maxZIndex + 1,
          };
          dispatch(updateNode(updatedChildNode));
        });
      } else if (node.parentNode) {
        // Если это внутренняя нода, поднимаем её и её родительскую группу на передний план
        const parentNode = nodes.find((n) => n.id === node.parentNode);
        if (parentNode) {
          // Обновляем z-index для родительской группы
          const updatedParentNode = {
            ...parentNode,
            zIndex: maxZIndex + 1,
          };
          dispatch(updateNode(updatedParentNode));

          // Обновляем z-index для всех внутренних нод в той же группе
          const siblingNodes = nodes.filter(
            (n) => n.parentNode === node.parentNode,
          );
          siblingNodes.forEach((siblingNode) => {
            const updatedSiblingNode = {
              ...siblingNode,
              zIndex: maxZIndex + (siblingNode.id === node.id ? 2 : 1),
            };
            dispatch(updateNode(updatedSiblingNode));
          });
        }
      } else {
        // Если это обычная нода (не групповая и не внутренняя), просто поднимаем её на передний план
        const updatedNode = {
          ...node,
          zIndex: maxZIndex + 1,
        };
        dispatch(updateNode(updatedNode));
      }
    },
    [nodes, dispatch],
  );

  // Функция для обновления нод
  const onNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const updatedNode = {
              ...node,
              position: change.position,
            };
            dispatch(updateNode(updatedNode));
          }
        }
      });
    },
    [nodes, dispatch],
  );

  // Функция для обновления связей
  const onEdgesChange = useCallback(
    (changes) => {
      // В данном случае, изменения связей обрабатываются через onConnect
    },
    [dispatch],
  );

  // Обработчик двойного клика по ребру - удаление ребра
  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      dispatch(removeEdge(edge.id));
    },
    [dispatch],
  );

  // Обработчик обновления ребра
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      // Удаляем старое ребро
      dispatch(removeEdge(oldEdge.id));

      // Создаем новое ребро с обновленным соединением
      const updatedEdge = {
        ...newConnection,
        id: `edge-${newConnection.source}-${newConnection.target}`,
        style: {
          strokeWidth: 3, // Устанавливаем толщину линии 3 пикселя
        },
        markerEnd: { type: "arrowclosed" },
        deletable: true,
        reconnectable: true,
        updatable: true,
      };

      dispatch(addEdgeAction(updatedEdge));
    },
    [dispatch],
  );

  // Обработчик начала обновления ребра
  const onEdgeUpdateStart = useCallback((event, edge, handleType) => {
    // Начало перетаскивания ребра
  }, []);

  // Обработчик окончания обновления ребра
  const onEdgeUpdateEnd = useCallback(
    (event, edge, handleType) => {
      // Если ребро отпущено в пустом месте (без соединения с узлом), удаляем его
      if (!edge.target && !edge.sourceHandle) {
        dispatch(removeEdge(edge.id));
      }
    },
    [dispatch],
  );

  // Функция для добавления новой группы экрана
  const handleAddScreen = useCallback(() => {
    if (reactFlowRef.current && reactFlowRef.current.addScreenAndNavigate) {
      reactFlowRef.current.addScreenAndNavigate();
    }
  }, []);

  // Функция для автоматического вертикального размещения нод с использованием ELK
  const handleLayoutVertical = useCallback(() => {
    reactFlowRef.current.layout(nodes, edges, { "elk.direction": "DOWN" });
  }, [nodes, edges, dispatch, reactFlowRef]);

  // Функция для автоматического горизонтального размещения нод с использованием ELK
  const handleLayoutHorizontal = useCallback(() => {
    reactFlowRef.current.layout(nodes, edges, { "elk.direction": "RIGHT" });
  }, [nodes, edges, dispatch, reactFlowRef]);

  // Функция для автоматического размещения нод по алгоритму rectpacking
  const handleLayoutRectPacking = useCallback(() => {
    reactFlowRef.current.layout(nodes, edges, {
      "elk.algorithm": "rectpacking",
    });
  }, [nodes, edges, dispatch, reactFlowRef]);

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
      acceptClassName: "p-button-success",
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
                toast.current.show({
                  severity: "success",
                  summary: "Успешно",
                  detail: "Данные успешно загружены из файла!",
                  life: 3000,
                });
              },
              (error) => {
                console.error("Ошибка при чтении файла:", error);
                toast.current.show({
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
  }, [dispatch, toast]);

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
      toast.current.show({
        severity: "success",
        summary: "Успешно",
        detail: "Данные успешно сохранены на сервере!",
        life: 3000,
      });
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Произошла ошибка при сохранении данных на сервере.",
        life: 3000,
      });
    }
  }, [nodes, edges, toast]);

  // Функция для публикации данных на сервер
  const handlePublishData = useCallback(async () => {
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
      toast.current.show({
        severity: "success",
        summary: "Успешно",
        detail: "Данные успешно опубликованы на сервере!",
        life: 3000,
      });
    } catch (error) {
      console.error("Ошибка при публикации данных:", error);
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Произошла ошибка при публикации данных на сервере.",
        life: 3000,
      });
    }
  }, [nodes, edges, toast]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <PrimeReactProvider
        value={{
          locale: "ru",
          hideOverlaysOnDocumentScrolling: true,
          zIndex: {
            modal: 1000001, // dialog, sidebar
            overlay: 1000001, // dropdown, overlaypanel
            menu: 1000010, // overlay menus
            tooltip: 1000020, // tooltip
            toast: 1000030, // toast
          },
        }}
      >
        <DialogManager />
        <Toast ref={toast} position="bottom-right" />
        <TopPanel
          onAddScreen={handleAddScreen}
          onClearAllGroups={handleClearAllGroups}
          onLayoutVertical={handleLayoutVertical}
          onLayoutHorizontal={handleLayoutHorizontal}
          onLayoutRectPacking={handleLayoutRectPacking}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onSaveData={handleSaveData}
          onPublishData={handlePublishData}
        />
        <div
          style={{
            width: "100%",
            height: "calc(100% - 60px)",
            position: "relative",
            top: "60px",
          }}
        >
          <ReactFlowProvider>
            <ReactFlowComponent
              ref={reactFlowRef}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgeDoubleClick={onEdgeDoubleClick}
              onEdgeUpdate={onEdgeUpdate}
              onEdgeUpdateStart={onEdgeUpdateStart}
              onEdgeUpdateEnd={onEdgeUpdateEnd}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
            />
          </ReactFlowProvider>
        </div>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
