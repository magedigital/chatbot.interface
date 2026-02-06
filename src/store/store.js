import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./nodesSlice";
import configReducer from "./configSlice";
import editorReducer from "./editorSlice";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    config: configReducer,
    editor: editorReducer,
  },
});

export default store;
