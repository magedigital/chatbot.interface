/**
 * Конфигурационные параметры для нод и групп
 */

// Параметры для групп экранов
export const GROUP = {
  width: 230,
  height: 220,
  initialX: 50,
  initialY: 50,
  offsetX: 50,
  offsetY: 50,
  minHeight: 100,
  controlsHeight: 40,
  topHeight: 40,
  verticalPadding: 20,
  verticalSpacing: 10,
  border: 2,
  borderRadius: 8,
  handleSize: 20,
  borderColor: "rgba(255, 255, 255, 0.4)",
  colors: [
    "rgba(156, 147, 229, 0.8)",
    "rgba(199, 163, 210, 0.8)",
    "rgba(186, 140, 190, 0.8)",
    "rgba(127, 78, 168, 0.8)",
  ],
  handleBackgroundColor: "#fff",
  handleBorderColor: "#fff",
  defaultName: "Экран",
  mainName: "Стартовый экран",
  uidPrefix: "screen-node-",
};

// Параметры для внутренних нод
export const NODE = {
  width: 180,
  height: 50,
  groupVerticalPadding: 10,
  groupVerticalSpacing: 10,
  border: 2,
  borderRadius: 4,
  handleSize: 15,
  borderColor: "rgba(255, 255, 255, 0.8)",
  colors: [
    "#fdc576", // Light Orange
    "#ffaeab", // Light Pink
    "#f4b2e5", // Light Magenta
    "#89d6ff", // Light Blue
    "#8ce5cb", // Light Green
  ],
  defaultNodeColor: "rgb(99, 102, 241)",
  handleBackgroundColor: "#fff",
  handleBorderColor: "#fff",
  defaultName: "Кнопка",
  mainName: "Старт",
  uidSuffix: "-button-",
};
