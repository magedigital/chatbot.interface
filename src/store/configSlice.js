import { createSlice } from "@reduxjs/toolkit";

// Получаем конфигурацию из глобального объекта, если он существует
const getConfigFromGlobal = () => {
  if (typeof window !== "undefined" && window.config) {
    return {
      loadUrl: window.config.loadUrl || "",
      saveUrl: window.config.saveUrl || "",
      publishUrl: window.config.publishUrl || "",
    };
  }
  return {
    loadUrl: "",
    saveUrl: "",
    publishUrl: "",
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
