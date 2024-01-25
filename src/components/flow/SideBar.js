import React, { useContext, useEffect, useState } from 'react';
import fetchApi from '../../utils/request/requests';
import { AppContext } from '../../provider/appProvider';
import { CloseRounded, DeleteRounded } from '@mui/icons-material';
import Confirm from '../overlay/confirm';


// const availableNode = {
//     onMessage: "onMessage",
//     sendMessage: "sendMessage",
//     timer: "timer",
//     comparator: "comparator",
//     function: "funciton"
// }
const availableNode = {
    TimerNode: "Timer",
    FunctionNode: "Funciton",
    ComparatorNode: "Comparator"
}


export default () => {
    const [customNodes, setCustomNodes] = useState([])
    const [nodeToDelete, setnodeToDelete] = useState("")
    const { localServerUrl, localServerPort, reload, setOverlay, setOverlayComponent, setReload } = useContext(AppContext)
    const onDragStart = (event, nodeType, data = null) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow/data', data);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDeleteNode = (e) => {
        e.preventDefault();
        setOverlay(true)
        setOverlayComponent({
            Component: Confirm,
            props: { children: "Delete this function?", onClick: deleteNode }
        })
    }

    const deleteNode = () => {
        setOverlay(false)
        const data = { name: nodeToDelete }
        fetchApi("POST", localServerUrl, localServerPort, "functions/delete", data).then(() => setReload(!reload))
    }

    useEffect(() => {
        fetchApi("GET", localServerUrl, localServerPort, "functions/").then((response) => {
            setCustomNodes(response)
        })


    }, [, reload])


    return (
        <aside>
            <div className="w-full px-2 py-1 font-semibold border-y">Default Nodes</div>
            <div className='flex flex-wrap'>
                {Object.entries(availableNode).map(([element, value], key) => (
                    <div className="flex items-center justify-center w-24 text-align-center h-12 shadow-sm bg-indigo-100 hover:bg-indigo-50 cursor-grab rounded m-2" onDragStart={(event) => onDragStart(event, element)} draggable>
                        {value}
                    </div>
                ))}
            </div>
            <div className="w-full px-2 py-1 font-semibold border-y mt-2">Custom Nodes</div>
            <div className='flex flex-wrap'>
                {customNodes?.map((item, key) => (
                    <div key={item.name} className="relative flex items-center justify-center w-24 text-align-center h-12 shadow-sm bg-indigo-100 hover:bg-indigo-50 cursor-grab rounded m-2" onDragStart={(event) => onDragStart(event, item.type, item.data)} draggable>
                        <div className="absolute top-[-7px]  right-[-3px]  text-gray-600 hover:text-gray-800 cursor-pointer" onClick={(e) => { setnodeToDelete(item.name); handleDeleteNode(e) }}>
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