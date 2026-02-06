import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
  loadDataFromServer,
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
import TopMenu from "./components/TopMenu";
import DialogManager from "./components/DialogManager";

import * as locales from "./locales/ru.json";
import { UI } from "./config/uiConfig.js";
import { Skeleton } from "primereact/skeleton";

const initialNodes = [];
const initialEdges = [];

function App() {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const reactFlowRef = useRef(null);
  const menubarRef = useRef(null);
  const { nodes, edges } = useSelector((state) => state.nodes);

  const [canShow, setCanShow] = useState(false);

  // Инициализация начальных данных
  useEffect(() => {
    dispatch(setNodes(initialNodes));
    dispatch(setEdges(initialEdges));
    addLocale("ru", locales["ru"]);
    // Загрузка конфигурации из глобального объекта
    if (window.config) {
      dispatch(updateConfig(window.config));

      // Загрузка данных с сервера, если указан loadUrl
      if (window.config.loadUrl) {
        loadDataFromServer(window.config.loadUrl)
          .then((data) => {
            if (data.nodes) {
              dispatch(setNodes(data.nodes));
            }
            if (data.edges) {
              dispatch(setEdges(data.edges));
            }
            reactFlowRef.current.fit(0);
            setCanShow(true);
          })
          .catch((error) => {
            console.error("Ошибка при загрузке данных с сервера:", error);
            toast.current.show({
              severity: "error",
              summary: "Ошибка",
              detail: "Произошла ошибка при загрузке данных с сервера.",
              life: 3000,
            });
            setCanShow(true);
          });
      }
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


  return (
    <div style={{ backgroundColor: "var(--surface-50)" }}>
      {!canShow && (
        <div className="absolute flex flex-column gap-1 w-screen h-screen p-1">
          <Skeleton width="100%" height={UI.topMenuHeight}></Skeleton>
          <Skeleton width="100%" height="100%"></Skeleton>
        </div>
      )}
      <div
        className={
          "relative w-screen h-screen transition-opacity transition-delay-300 transition-duration-1000" +
          (canShow ? " opacity-100" : " opacity-0")
        }
        style={{
          transition: "opacity",
          transitionDelay: "300ms",
          transitionDuration: "1000ms",
        }}
      >
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
            cssLayer: true,
          }}
        >
          <DialogManager />
          <Toast ref={toast} position="bottom-right" />
          <TopMenu reactFlowRef={reactFlowRef} toast={toast} />
          <div
            style={{
              width: "100%",
              height: `calc(100% - ${UI.topMenuHeight}px)`,
              position: "absolute",
              top: UI.topMenuHeight,
              left: 0,
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
    </div>
  );
}

export default App;
