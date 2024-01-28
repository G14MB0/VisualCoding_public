import React, { useState, useEffect, useCallback, useRef, useContext, useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, ReactFlowProvider, SmoothStepEdge, useStoreApi, Background, BackgroundVariant, useOnSelectionChange } from 'reactflow';


import 'reactflow/dist/style.css';
import TimerNode from './customNodes/TimerNode';
import FunctionNode from './customNodes/FunctionNode';
import SideBar from './SideBar';
import fetchApi from '../../utils/request/requests';
import { AppContext } from '../../provider/appProvider';
import ComparatorNode from './customNodes/ComparatorNode';
import { CachedRounded, PlayArrowRounded, Save, SaveSharp, SavingsRounded, StopRounded, UploadFile } from '@mui/icons-material';
import { closeWs, openWs } from './utils';
import DebugNode from './customNodes/DebugNode';
import SumNode from './customNodes/operations/SumNode';
import { getNodeTypes, getAdditionalData } from './nodeDefinition';
import SimpleFloatingEdge from './customNodes/SimpleFloatingEdge';



const connectionLineStyle = { stroke: '#333333', type: "smootstep" };
const snapGrid = [20, 20];

const MIN_DISTANCE = 850;

const edgeTypes = {
    floating: SimpleFloatingEdge,
};

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

    // const [selectedNodes, setSelectedNodes] = useState(new Set());
    // const [selectedEdges, setSelectedEdges] = useState(new Set());

    // History state to keep track of past node and edge states
    const [history, setHistory] = useState({ nodes: [], edges: [], currentIndex: -1 });


    /* ************************************************* */
    /*               NODES BASIC DEFINITION              */
    /* ************************************************* */

    const store = useStoreApi();


    // handle passed to dynamic node that propagate data
    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node)));
    };

    // define nodeTypes, relate a type (str) to a react child element
    const nodeTypes = useMemo(() => getNodeTypes(updateNodeData), []);



    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => addEdge({ ...params, animated: false, type: "smoothstep" }, eds)),
        [setEdges]
    );

    // useOnSelectionChange(({ nodes }) => {
    //     const selectedNodeIds = new Set(nodes.map(node => node.id));
    //     const selectedEdgeIds = new Set(edges.map(edge => edge.id));
    //     setSelectedNodes(selectedNodeIds);
    //     setSelectedEdges(selectedEdgeIds);
    // });

    /* ************************************************* */
    /*             DRAG AND DROP EVENT HANDLER           */
    /* ************************************************* */
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
                dragHandle: ".drag_Handle",
                style: styleParsed,
                data: { ...dataParsed, label: `${type} node`, id: localId, style: style, ...getAdditionalData(type) },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );


    /* ************************************************* */
    /*   GENERIC HANDLER FUNCTIONS (with API fetch)      */
    /* ************************************************* */
    // Handle for saving graph definition to backend
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



    // Helper function to compare significant changes in nodes and edges
    const hasSignificantChange = (newNodes, newEdges, lastNodes, lastEdges) => {
        // Check if the number of nodes or edges has changed
        const nodesCountChanged = newNodes.length !== lastNodes.length;
        const edgesCountChanged = newEdges.length !== lastEdges.length;

        // Compare node data, ignoring positions
        const nodesChanged = newNodes.some((node, index) => {
            const lastNode = lastNodes[index];
            // Check if the node exists in both arrays and if data has changed
            return lastNode ? (node.data !== lastNode.data) : true;
        });

        // Compare edge data
        const edgesChanged = newEdges.some((edge, index) => {
            const lastEdge = lastEdges[index];
            // Check if the edge exists in both arrays and if source, target, or data has changed
            return lastEdge ? (edge.source !== lastEdge.source || edge.target !== lastEdge.target || edge.data !== lastEdge.data) : true;
        });

        // Return true if any condition is met
        return nodesCountChanged || edgesCountChanged || nodesChanged || edgesChanged;
    };



    /* ************************************************* */
    /*    UseEffects TO CALL FUNCTIONS BASED ON EVENT    */
    /* ************************************************* */
    // At each reload, get the node definition from backend and create the graph 
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
            // Add 'dragHandle' property to each node
            const updatedNodes = response.nodes.map(node => ({
                ...node,
                dragHandle: '.drag_Handle'
            }));

            // Concatenate the updated nodes with the existing ones
            setNodes((nds) => nds.concat(updatedNodes));

            // Ensure each edge has a unique ID
            const uniqueEdges = response.edges.map((edge, index) => {
                // Assuming each edge does not already have a unique ID, assign one here
                // If edges already have IDs but are not unique, you might need to generate new ones instead
                return { ...edge, id: edge.id || `edge_${index}` };
            });
            setEdges(uniqueEdges);
        });
    }, [reload])


    // At each node change, check if a significant change happen and update the graphHistory. used for ctrl+z
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


    // also save the graph if the nodes or edges array changes in length. also save to file
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
            console.log(history.currentIndex)
            setHistory((prevHistory) => ({
                ...prevHistory,
                currentIndex: prevHistory.currentIndex - 1
            }));
        }
    }, [history, setNodes, setEdges]);

    // Redo function to revert to the next state
    const redo = useCallback(() => {
        console.log(history)
        if (history.currentIndex < history.nodes.length - 1) {
            console.log("De-Annullando")

            setNodes(history.nodes[history.currentIndex + 1]);
            setEdges(history.edges[history.currentIndex + 1]);
            setHistory((prevHistory) => ({
                ...prevHistory,
                currentIndex: prevHistory.currentIndex + 1
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

    // Setup keyboard event listener for redo (Ctrl+Y)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'y') {
                redo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [redo]);


    // change css to active (in execution) nodes
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
                            node.style = { ...node.style, boxShadow: "0px 0px 6px 2px rgba(0, 130, 255, 0.8)", transition: "box-shadow 0.3s" };
                        } else {
                            // If the node is not running, set the background color to white
                            node.style = { ...node.style, boxShadow: "0px 0px", transition: "box-shadow 0.3s" };
                        }
                    } else {
                        // If the activeNode does not exist or does not have isRunning, set the background color to white
                        node.style = { ...node.style, boxShadow: "0px 0px", transition: "box-shadow 0.3s" };
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
        //
        // Defined over the appProvider, since the storeApi is itself a provider and can't be accessed at higer lever with respect to ReactFlowProvider.
        // 
        // <ReactFlowProvider>
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
                edgeTypes={edgeTypes}
                connectionLineStyle={connectionLineStyle}
                snapToGrid={false}
                snapGrid={snapGrid}
                fitView
                attributionPosition="bottom-left"
                deleteKeyCode={"Delete"}
            >
                <Background variant={BackgroundVariant.Cross} gap={50} />
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
        </div>

        // </ReactFlowProvider >
    );
};
