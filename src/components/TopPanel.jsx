import React from 'react';
import { Button } from 'primereact/button';

const TopPanel = ({ onAddScreen, onClearAllGroups, onLayout }) => {
  return (
    <div
      style={{
        height: '60px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <Button
        label="Добавить экран"
        icon="pi pi-plus"
        onClick={() => onAddScreen()}
        className="p-button p-component"
        style={{ marginRight: '10px' }}
      />
      <Button
        label="Расположить"
        icon="pi pi-sort-alt"
        onClick={() => onLayout()}
        className="p-button p-component"
        style={{ marginRight: '10px' }}
      />
      <Button
        label="Очистить"
        icon="pi pi-trash"
        onClick={() => onClearAllGroups()}
        className="p-button-danger p-button p-component"
      />
    </div>
  );
};

export default TopPanel;