import React, { forwardRef, useImperativeHandle } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from "reactflow";
import { useDispatch } from "react-redux";
import { addScreenGroupNode } from "../store/nodesSlice";
import { getLayoutedElements } from "../utils/layoutUtils";
import { elkOptions } from "../config/layoutConfig";
import { setNodes, setEdges } from "../store/nodesSlice";

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

    // Экспортируем методы для взаимодействия с ReactFlow через ref
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
      layout: async (currentNodes, currentEdges, layoutOptions) => {
        const options = {
          ...elkOptions,
          ...layoutOptions,
        };

        const { nodes: layoutedNodes, edges: layoutedEdges } =
          await getLayoutedElements(currentNodes, currentEdges, options);

        if (layoutedNodes && layoutedEdges) {
          dispatch(setNodes(layoutedNodes));
          dispatch(setEdges(layoutedEdges));
          setTimeout(() => {
            reactFlowInstance.fitView({
              duration: 500,
              ease: "smooth",
              padding: 0.1,
            });
          }, 100);
        }
      },
      fit: async (duration = 500) => {
        setTimeout(() => {
          reactFlowInstance.fitView({
            duration,
            ease: "smooth",
            padding: 0.1,
          });
        }, 100);
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
