import React from "react";
import ScreenGroupNode from "./ScreenGroupNode";

// Обертка для ScreenGroupNode, которая передает обработчик добавления ноды
const ScreenGroupNodeWrapper = ({ data, id, ...props }) => {
  const handleAddInnerNode = (groupId) => {
    if (typeof window.addScreenNode === 'function') {
      // Вызываем глобальную функцию, она сама определит количество нод в группе
      window.addScreenNode(groupId, 0, () => {});
    }
  };

  return (
    <ScreenGroupNode
      data={data}
      id={id}
      onAddInnerNode={handleAddInnerNode}
      {...props}
    />
  );
};

export default ScreenGroupNodeWrapper;