import React, { useCallback, forwardRef, useImperativeHandle } from "react";
import ReactFlow, { MiniMap, Controls, Background, useReactFlow } from "reactflow";
import { useDispatch } from "react-redux";
import { addScreenGroupNode } from "../store/nodesSlice";
import { Button } from "primereact/button";

const ReactFlowComponent = forwardRef(({ onNodeDragStart, onNodeDragStop, onNodesChange, onEdgesChange, onConnect, onEdgeDoubleClick, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, nodes, edges, nodeTypes }, ref) => {
  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();

  // Экспортируем метод для добавления экрана через ref
  useImperativeHandle(ref, () => ({
    addScreenAndNavigate: () => {
      const result = dispatch(addScreenGroupNode());
      const groupId = result.payload;

      if (groupId) {
        // Навигация к новой ноде
        reactFlowInstance.fitView({
          nodes: [{ id: groupId }],
          duration: 500,
        });
      }

      return groupId;
    }
  }));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        nodeTypes={nodeTypes}
        zoomOnDoubleClick={false}
        fitView={true}
      >
        <Controls />
        <MiniMap />
        <Background
          variant="dots"
          gap={20}
          size={1}
          color="#E9B1A3"
          style={{ backgroundColor: "#2F435A" }}
        />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowComponent;