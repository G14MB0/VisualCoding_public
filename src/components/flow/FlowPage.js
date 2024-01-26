import React, { useState, useEffect, useCallback, useRef, useContext, useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, ReactFlowProvider, SmoothStepEdge } from 'reactflow';


import 'reactflow/dist/style.css';
import TimerNode from './customNodes/TimerNode';
import FunctionNode from './customNodes/FunctionNode';
import SideBar from './SideBar';
import fetchApi from '../../utils/request/requests';
import { AppContext } from '../../provider/appProvider';
import ComparatorNode from './customNodes/ComparatorNode';
import { PlayArrowRounded, Save, SaveSharp, SavingsRounded, StopRounded, UploadFile } from '@mui/icons-material';
import { closeWs, openWs } from './utils';
import DebugNode from './customNodes/DebugNode';
import SumNode from './customNodes/operations/SumNode';



const connectionLineStyle = { stroke: '#333333', type: "smootstep" };
const snapGrid = [20, 20];


const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `node_${++id}`;

export default function FlowPage() {
    const { localServerUrl, localServerPort, save, setSave, fileUsed, setFileUsed, reload, setReload } =
        useContext(AppContext);


    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [ws, setWs] = useState(null);
    const [activeNode, setActiveNode] = useState({});

    // History state to keep track of past node and edge states
    const [history, setHistory] = useState({ nodes: [], edges: [], currentIndex: -1 });


    // handle passed to dynamic node that propagate data
    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node)));
    };

    const nodeTypes = useMemo(() => ({
        ComparatorNode: (nodeProps) => <ComparatorNode updateNodeData={updateNodeData} conn {...nodeProps} />,
        TimerNode: (nodeProps) => <TimerNode updateNodeData={updateNodeData} {...nodeProps} />,
        FunctionNode: (nodeProps) => <FunctionNode updateNodeData={updateNodeData} {...nodeProps} />,
        DebugNode: (nodeProps) => <DebugNode updateNodeData={updateNodeData} {...nodeProps} />,
        SumNode: (nodeProps) => <SumNode updateNodeData={updateNodeData} {...nodeProps} />,
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
            const dataTemp = event.dataTransfer.getData('application/reactflow/data');
            const styleTemp = event.dataTransfer.getData('application/reactflow/style');
            const dataParsed = JSON.parse(dataTemp)
            const styleParsed = JSON.parse(styleTemp)
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
            const style = styleParsed
            const newNode = {
                id: localId,
                type,
                position,
                style: styleParsed,
                data: { ...dataParsed, label: `${type} node`, id: localId, style: style },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );


    const handleSaveGraph = async () => {
        const data = {
            nodes,
            edges
        };
        console.log(data)
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
    }, [reload])


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

        if (hasSignificantChange(nodes, edges, lastNodes, lastEdges)) {
            handleSaveGraph();
            if (fileUsed != "") fetchApi("POST", localServerUrl, localServerPort, "nodes/save", { filePath: fileUsed })
        }

        // Only update history if there's a significant change
        if (history.currentIndex === -1 || hasSignificantChange(nodes, edges, lastNodes, lastEdges)) {

            newHistory.nodes = [...newHistory.nodes.slice(0, newHistory.currentIndex + 1), nodes];
            newHistory.edges = [...newHistory.edges.slice(0, newHistory.currentIndex + 1), edges];
            newHistory.currentIndex += 1;


            setHistory(newHistory);
        }
    }, [nodes, edges]);

    useEffect(() => {
        handleSaveGraph();
        if (fileUsed != "") fetchApi("POST", localServerUrl, localServerPort, "nodes/save", { filePath: fileUsed })

    }, [nodes.length, edges.length, save])


    // Undo function to revert to the previous state
    const undo = useCallback(() => {
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
        setNodes((nds) =>
            nds.map((node) => {
                // Check if ws is null and set node style to default
                if (ws === null) {
                    node.style = { ...node.style, boxShadow: "0px 0px" };
                } else {
                    if (activeNode[node.id] && activeNode[node.id].hasOwnProperty('value')) {
                        node.data = { ...node.data, value: activeNode[node.id]["value"] }
                    }
                    // Check if activeNode for the current node exists and has the isRunning property
                    if (activeNode[node.id] && activeNode[node.id].hasOwnProperty('isRunning')) {
                        // If the node is running, set the background color to azure
                        if (activeNode[node.id]["isRunning"] === 'running') {
                            node.style = { ...node.style, boxShadow: "0px 0px 6px 2px rgba(0, 130, 255, 0.8)", transition: "all 0.3s" };
                        } else {
                            // If the node is not running, set the background color to white
                            node.style = { ...node.style, boxShadow: "0px 0px", transition: "all 0.3s" };
                        }
                    } else {
                        // If the activeNode does not exist or does not have isRunning, set the background color to white
                        node.style = { ...node.style, boxShadow: "0px 0px", transition: "all 0.3s" };
                    }
                }
                return node;
            })
        );


    }, [activeNode, ws])


    // useEffect(() => {
    //     console.log(nodes);
    //     console.log(edges)

    // }, [nodes.length, edges.length])



    return (
        <div className="dndflow">
            <div className='absolute top-13 right-0 z-10 px-2 flex justify-between items-center lg:w-[calc(100%-250px)] w-[calc(100%-150px)] bg-neutral-200 shadow-inner'>
                <div>
                    <button className=''
                        onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/run"); openWs(localServerUrl, localServerPort, setWs, setActiveNode) }}><PlayArrowRounded className='text-gray-700' /></button>
                    <button className=''
                        onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/stop"); closeWs(ws, setWs) }}><StopRounded className='text-gray-700' /></button>
                </div>
                <div className='w-12'>{ }</div>

                <div>
                    <button className='ml-1'
                        onClick={() => { fetchApi("POST", localServerUrl, localServerPort, "nodes/save", { filePath: fileUsed }).then((response) => { setSave(!save); setFileUsed(response.filePath); setReload(!reload) }) }}><SaveSharp className='text-gray-700' fontSize='small' /></button>
                    <button className='ml-1'
                        onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/load").then((response) => { setFileUsed(response.filePath); setNodes([]); setEdges([]); setReload(!reload) }) }}><UploadFile className='text-gray-700' fontSize='small' /></button>

                </div>
            </div>
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}></div>
                <SideBar />
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

            </ReactFlowProvider >
        </div>
    );
};
