import { createSlice } from "@reduxjs/toolkit";

// Получаем конфигурацию из глобального объекта, если он существует
const getConfigFromGlobal = () => {
  if (typeof window !== "undefined" && window.config) {
    return {
      loadUrl: window.config.loadUrl || "",
      saveUrl: window.config.saveUrl || "",
      publishUrl: window.config.publishUrl || "",
      commandOptions: window.config.commandOptions || [],
      miniAppOptions: window.config.miniAppOptions || [],
      userStatusOptions: window.config.userStatusOptions || [],
    };
  }
  return {
    loadUrl: "",
    saveUrl: "",
    publishUrl: "",
    commandOptions: [],
    miniAppOptions: [],
    userStatusOptions: [],
  };
};

const initialState = getConfigFromGlobal();

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateConfig: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateConfig } = configSlice.actions;

export default configSlice.reducer;
