import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import ReactFlowComponent from "./components/ReactFlowComponent";

import { Toast } from "primereact/toast";
import { setNodes, setEdges } from "./store/nodesSlice";
import { updateConfig } from "./store/configSlice";
import { loadDataFromServer } from "./utils/dataUtils";
import "reactflow/dist/style.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
// import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./css/quill-editor-custom-styles.css";

import { addLocale, PrimeReactProvider } from "primereact/api";

import TopMenu from "./components/TopMenu";
import DialogManager from "./components/DialogManager";

import * as locales from "./locales/ru.json";
import { UI } from "./config/uiConfig.js";
import { Skeleton } from "primereact/skeleton";

const initialNodes = [];
const initialEdges = [];

function App() {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const reactFlowRef = useRef(null);
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
            toastRef.current.show({
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
          <Toast ref={toastRef} position="bottom-right" />
          <TopMenu reactFlowRef={reactFlowRef} toastRef={toastRef} />
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
              <ReactFlowComponent ref={reactFlowRef} />
            </ReactFlowProvider>
          </div>
        </PrimeReactProvider>
      </div>
    </div>
  );
}

export default App;
