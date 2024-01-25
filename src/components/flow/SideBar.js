import React from 'react';


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
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">You can drag these nodes to the pane on the right.</div>
            {Object.entries(availableNode).map(([element, value], key) => (
                <div className="flex items-center justify-center text-align-center h-12 shadow-sm bg-indigo-100 hover:bg-indigo-50 cursor-grab rounded-lg my-2" onDragStart={(event) => onDragStart(event, element)} draggable>
                    {value}
                </div>
            ))}
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