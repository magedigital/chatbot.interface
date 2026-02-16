import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./nodesSlice";
import configReducer from "./configSlice";
import editorReducer from "./editorSlice";

// Middleware для логирования экшнов
const logger = (store) => (next) => (action) => {
  console.group(`%cRedux Action: ${action.type}`, 'color: #03A9F4; font-weight: bold;');
  console.log('%cPrevious State:', 'color: #9E9E9E; font-weight: bold;', store.getState());
  console.log('%cAction:', 'color: #00C853; font-weight: bold;', action);
  const result = next(action);
  console.log('%cNext State:', 'color: #FF9800; font-weight: bold;', store.getState());
  console.groupEnd();
  return result;
};

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    config: configReducer,
    editor: editorReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
