import React, { useState, useEffect, useCallback, useRef, useContext, useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, ReactFlowProvider, SmoothStepEdge } from 'reactflow';


import 'reactflow/dist/style.css';
import ColorSelectorNode from './customNodes/ColorSelectorNode';
import TimerNode from './customNodes/TimerNode';
import FunctionNode from './customNodes/FunctionNode';
import SideBar from './SideBar';
import fetchApi from '../../utils/request/requests';
import { AppContext } from '../../provider/appProvider';
import ComparatorNode from './customNodes/ComparatorNode';



const connectionLineStyle = { stroke: '#333333', type: "smootstep" };
const snapGrid = [20, 20];



const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `node_${++id}`;

export default function FlowPage() {
    const { localServerUrl, localServerPort, save } =
        useContext(AppContext);


    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // History state to keep track of past node and edge states
    const [history, setHistory] = useState({ nodes: [], edges: [], currentIndex: -1 });


    // handle passed to dynamic node that propagate data
    const updateNodeData = (nodeId, newData) => {
        console.log(nodeId)
        setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node)));
    };

    const nodeTypes = useMemo(() => ({
        ComparatorNode: (nodeProps) => <ComparatorNode updateNodeData={updateNodeData} conn {...nodeProps} />,
        TimerNode: (nodeProps) => <TimerNode updateNodeData={updateNodeData} {...nodeProps} />,
        FunctionNode: (nodeProps) => <FunctionNode updateNodeData={updateNodeData} {...nodeProps} />,
    }), []);


    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => addEdge({ ...params, animated: false, type: "smoothstep" }, eds)),
        [setEdges]
    );


    // handle for during the drag event
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);





    // handle for end of drag event
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const localId = getId();
            const newNode = {
                id: localId,
                type,
                position,
                data: { label: `${type} node`, id: localId },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );



    useEffect(() => {

        const handleSaveGraph = async () => {
            const data = {
                nodes,
                edges
            };

            try {
                const response = await fetchApi("POST",
                    localServerUrl,
                    localServerPort,
                    "nodes/graph",
                    data)

                // Handle success scenario (e.g., showing a success message)
            } catch (error) {
                console.error('Error:', error);
                // Handle error scenario (e.g., showing an error message)
            }
        };
        console.log("Saving to Python")
        handleSaveGraph();

    }, [nodes.length, edges.length, save])


    useEffect(() => {
        // Assuming IDs are in the format "node_X" where X is a numeric value
        const getHighestNodeId = (nodes) => {
            return nodes.reduce((maxId, node) => {
                const currentId = parseInt(node.id.replace('node_', ''), 10);
                return currentId > maxId ? currentId : maxId;
            }, 0);
        };

        fetchApi("GET", localServerUrl, localServerPort, "nodes/nodes").then((response) => {

            const highestNodeId = getHighestNodeId(response.nodes);
            id = highestNodeId; // Update the id variable to start from the highest existing ID
            setNodes((nds) => nds.concat(response.nodes))

            // Ensure each edge has a unique ID
            const uniqueEdges = response.edges.map((edge, index) => {
                // Assuming each edge does not already have a unique ID, assign one here
                // If edges already have IDs but are not unique, you might need to generate new ones instead
                return { ...edge, id: edge.id || `edge_${index}` };
            });
            setEdges(uniqueEdges);
        });
    }, [])


    // Use a helper function to compare significant changes in nodes and edges
    const hasSignificantChange = (newNodes, newEdges, lastNodes, lastEdges) => {
        // Example: Compare based on node data and edge connections, ignoring positions
        const nodesChanged = newNodes.some((node, index) => {
            if (lastNodes[index] && (node.data !== lastNodes[index].data)) {
                return true;
            }
            return false;
        });

        const edgesChanged = newEdges.length !== lastEdges.length || newEdges.some((edge, index) => {
            const lastEdge = lastEdges[index];
            return !lastEdge || edge.source !== lastEdge.source || edge.target !== lastEdge.target || edge.data !== lastEdge.data;
        });

        return nodesChanged || edgesChanged;
    };


    useEffect(() => {
        const newHistory = { ...history };
        const lastNodes = history.nodes[history.currentIndex] || [];
        const lastEdges = history.edges[history.currentIndex] || [];

        // Only update history if there's a significant change
        if (history.currentIndex === -1 || hasSignificantChange(nodes, edges, lastNodes, lastEdges)) {
            console.log("update history")
            newHistory.nodes = [...newHistory.nodes.slice(0, newHistory.currentIndex + 1), nodes];
            newHistory.edges = [...newHistory.edges.slice(0, newHistory.currentIndex + 1), edges];
            newHistory.currentIndex += 1;


            setHistory(newHistory);
        }
    }, [nodes, edges]);

    // Undo function to revert to the previous state
    const undo = useCallback(() => {
        console.log(history.currentIndex)

        if (history.currentIndex > 0) {
            console.log("Annullando")

            setNodes(history.nodes[history.currentIndex - 1]);
            setEdges(history.edges[history.currentIndex - 1]);
            setHistory((prevHistory) => ({
                ...prevHistory,
                currentIndex: prevHistory.currentIndex - 1
            }));
        }
    }, [history, setNodes, setEdges]);

    // Setup keyboard event listener for undo (Ctrl+Z)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'z') {
                undo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [undo]);

    useEffect(() => {
        console.log(nodes);
        console.log(edges)

    }, [nodes.length, edges.length])


    return (
        <div className="dndflow">
            <button
                onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/plot") }}>Plot</button>
            <button className='ml-2'
                onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/run") }}>Play</button>
            <button className='ml-2'
                onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/stop") }}>Stop</button>
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}></div>
                <ReactFlow
                    defaultEdgeOptions={{ type: 'smoothstep' }}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    style={{ background: "#fff" }}
                    nodeTypes={nodeTypes}
                    connectionLineStyle={connectionLineStyle}
                    snapToGrid={false}
                    snapGrid={snapGrid}
                    fitView
                    attributionPosition="bottom-left"
                    deleteKeyCode={"Delete"}
                >
                    <MiniMap
                    // nodeStrokeColor={(n) => {
                    //     if (n.type === 'input') return '#0041d0';
                    //     if (n.type === 'output') return '#ff0072';
                    // }}
                    // nodeColor={(n) => {
                    //     return '#fff';
                    // }}
                    />
                    <Controls />
                </ReactFlow>
                <SideBar />
            </ReactFlowProvider >
        </div>
    );
};
