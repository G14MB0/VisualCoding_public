import React, { useContext, useEffect, useState } from 'react';
import fetchApi from '../../utils/request/requests';
import { AppContext } from '../../provider/appProvider';
import { CloseRounded, DeleteRounded } from '@mui/icons-material';
import Confirm from '../overlay/confirm';
import { availableNode, nodeStyles } from './nodeDefinition';



export default () => {
    const [customNodes, setCustomNodes] = useState([])
    const { localServerUrl, localServerPort, reload, setOverlay, setOverlayComponent, setReload, sideBarReload, setSideBarReload } = useContext(AppContext)
    const onDragStart = (event, nodeType, data = null, style = null) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow/data', data);
        event.dataTransfer.setData('application/reactflow/style', style);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDeleteNode = (e, nodeName) => {
        e.preventDefault();
        setOverlay(true)
        setOverlayComponent({
            Component: Confirm,
            props: { children: `Delete this function: ${nodeName}?`, onClick: () => deleteNode(nodeName) }
        })
    }

    const deleteNode = (nodeName) => {
        setOverlay(false)
        const data = { name: nodeName }
        fetchApi("POST", localServerUrl, localServerPort, "functions/delete", data).then(() => { setReload(!reload); setSideBarReload(!sideBarReload) })
    }

    useEffect(() => {
        fetchApi("GET", localServerUrl, localServerPort, "functions/").then((response) => {
            setCustomNodes(response)
        })
    }, [, sideBarReload])


    return (
        <aside>
            <div className="w-full px-2 py-1 font-semibold ">Default Nodes</div>
            <div className='flex flex-wrap'>
                {Object.entries(availableNode).filter(([, value]) => value.category === "default").map(([element, value], key) => (
                    <div key={key}
                        className={`flex items-center justify-center w-24 text-align-center h-12 shadow-sm hover:origin-top-left hover:-rotate-2 transition-all cursor-grab rounded m-2`}
                        style={{ backgroundColor: nodeStyles[element]['backgroundColor'] }}
                        onDragStart={(event) => onDragStart(event, element, null, JSON.stringify(nodeStyles[element]))}
                        draggable>
                        {value.name}
                    </div>
                ))}
            </div>
            <div className="w-full px-2 py-1 font-semibold  mt-4">Operation</div>
            <div className='flex flex-wrap'>
                {Object.entries(availableNode).filter(([, value]) => value.category === "operation").map(([element, value], key) => (
                    <div key={key}
                        className={`flex items-center justify-center w-12 text-align-center h-12 shadow-sm hover:origin-top-left hover:-rotate-2 transition-all cursor-grab rounded m-2`}
                        style={{ backgroundColor: nodeStyles[element]['backgroundColor'] }}
                        onDragStart={(event) => onDragStart(event, element, null, JSON.stringify(nodeStyles[element]))}
                        draggable>
                        {value.icon}
                    </div>
                ))}
            </div>
            <div className="w-full px-2 py-1 font-semibold  mt-4">Custom Nodes</div>
            <div className='flex flex-wrap'>
                {customNodes?.map((item, key) => (
                    <div
                        key={item.name}
                        style={{ backgroundColor: nodeStyles[item.type]['backgroundColor'] }}
                        className="relative flex items-center justify-center w-24 text-align-center h-12 shadow-sm hover:origin-top-left hover:-rotate-2 transition-all cursor-grab rounded m-2"
                        onDragStart={(event) => onDragStart(event, item.type, item.data, item.style)}
                        draggable>
                        <div className="absolute top-[-7px]  right-[-3px]  text-gray-600 hover:text-gray-800 cursor-pointer" onClick={(e) => { handleDeleteNode(e, item.name) }}>
                            &#x2715; {/* This is the Unicode character for a multiplication sign (X) */}
                        </div>
                        <div>
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Trigger
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Default Node
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Output Node
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'selectorNode')} draggable>
                selector Node
            </div> */}
        </aside>
    );
};

