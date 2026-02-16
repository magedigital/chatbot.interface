import { createSlice } from "@reduxjs/toolkit";

// Получаем конфигурацию из глобального объекта, если он существует
const getConfigFromGlobal = () => {
  if (typeof window !== "undefined" && window.config) {
    return {
      loadUrl: window.config.loadUrl || "",
      saveUrl: window.config.saveUrl || "",
      publishUrl: window.config.publishUrl || "",
      commandOptions: window.config.commandOptions || [
        { label: "Без команды", value: "-" },
        { label: "Команда 1", value: "Команда 1" },
        { label: "Команда 2", value: "Команда 2" },
        { label: "Команда 3", value: "Команда 3" },
        { label: "Команда 4", value: "Команда 4" },
        { label: "Команда 5", value: "Команда 5" },
      ],
      miniAppOptions: window.config.miniAppOptions || [
        { label: "Без мини-приложения", value: "-" },
        { label: "Мини-приложение 1", value: "Мини-приложение 1" },
        { label: "Мини-приложение 2", value: "Мини-приложение 2" },
      ],
      userStatusOptions: window.config.userStatusOptions || [
        { label: "Без изменений", value: "-" },
        { label: "Заполнил данные", value: "Заполнил данные" },
        { label: "Загрузил чек", value: "Загрузил чек" },
        { label: "Зарегистрировал код", value: "Зарегистрировал код" },
      ],
    };
  }
  return {
    loadUrl: "",
    saveUrl: "",
    publishUrl: "",
    commandOptions: [
      { label: "Без команды", value: "-" },
      { label: "Команда 1", value: "Команда 1" },
      { label: "Команда 2", value: "Команда 2" },
      { label: "Команда 3", value: "Команда 3" },
      { label: "Команда 4", value: "Команда 4" },
      { label: "Команда 5", value: "Команда 5" },
    ],
    miniAppOptions: [
      { label: "Без мини-приложения", value: "-" },
      { label: "Мини-приложение 1", value: "Мини-приложение 1" },
      { label: "Мини-приложение 2", value: "Мини-приложение 2" },
    ],
    userStatusOptions: [
      { label: "Без изменений", value: "-" },
      { label: "Заполнил данные", value: "Заполнил данные" },
      { label: "Загрузил чек", value: "Загрузил чек" },
      { label: "Зарегистрировал код", value: "Зарегистрировал код" },
    ],
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
