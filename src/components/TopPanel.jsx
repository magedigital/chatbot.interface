import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

const TopPanel = ({
  onAddScreen,
  onClearAllGroups,
  onLayoutVertical,
  onLayoutHorizontal,
  onLayoutRectPacking,
  onExportData,
}) => {
  const menu = useRef(null);

  const menuItems = [
    {
      label: "Расположить вертикально",
      icon: "pi pi-sort-alt",
      command: () => onLayoutVertical(),
    },
    {
      label: "Расположить горизонтально",
      icon: "pi pi-arrow-right-arrow-left",
      command: () => onLayoutHorizontal(),
    },
    {
      label: "Расположить по порядку",
      icon: "pi pi-th-large",
      command: () => onLayoutRectPacking(),
    },
    {
      label: "Очистить",
      icon: "pi pi-trash",
      command: () => onClearAllGroups(),
    },
  ];

  return (
    <div
      style={{
        height: "60px",
        backgroundColor: "var(--surface-ground)",
        borderBottom: "1px solid var(--surface-border)",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000000,
      }}
    >
      <Button
        label="Добавить экран"
        icon="pi pi-plus"
        onClick={() => onAddScreen()}
        className="p-button p-component"
        style={{ marginRight: "10px" }}
      />
      <Button
        label="Экспорт"
        icon="pi pi-upload"
        onClick={() => onExportData()}
        className="p-button p-button-info"
        style={{ marginRight: "10px" }}
      />
      <Button
        icon="pi pi-ellipsis-v"
        onClick={(e) => menu.current.toggle(e)}
        className="p-button p-component"
        style={{ marginLeft: "auto", marginRight: "20px" }}
      />
      <Menu ref={menu} model={menuItems} popup />
    </div>
  );
};

export default TopPanel;
