import React, { forwardRef, useImperativeHandle } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from "reactflow";
import { useDispatch } from "react-redux";
import { addScreenGroupNode } from "../store/nodesSlice";

const ReactFlowComponent = forwardRef(
  (
    {
      onNodeDragStart,
      onNodeDragStop,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onEdgeDoubleClick,
      onEdgeUpdate,
      onEdgeUpdateStart,
      onEdgeUpdateEnd,
      nodes,
      edges,
      nodeTypes,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const reactFlowInstance = useReactFlow();

    // Экспортируем метод для добавления экрана через ref
    useImperativeHandle(ref, () => ({
      addScreenAndNavigate: () => {
        const result = dispatch(addScreenGroupNode());
        const groupNode = result.payload;
        if (groupNode) {
          reactFlowInstance.fitBounds(
            {
              ...groupNode.position,
              width: groupNode.width,
              height: groupNode.height,
            },
            {
              duration: 500,
              ease: "smooth",
              padding: 3,
            },
          );
        }
        return groupNode.id;
      },
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
  },
);

export default ReactFlowComponent;
