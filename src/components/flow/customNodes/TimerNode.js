import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

import Dropdown from '../../UI/dropdown/Dropdown'

const mu = ["s", "m", "h"];


export default memo(({ data, isConnectable, updateNodeData }) => {
    const [selected, setSelected] = useState(data.selected)
    const [loop, setLoop] = useState(data.loop)
    const [timerInterval, setTimerInterval] = useState(data.timerInterval)

    const handleTimerInterval = (e) => {

        // const value = e.target.value;
        // Update state with the numeric value if it's a number, or reset to 0 (or keep empty for flexibility)
        setTimerInterval(e);
    }


    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, selected, loop, timerInterval });
        }
    }, [selected, updateNodeData, data.id, timerInterval, loop]);

    return (
        <div className='nodeBase'>
            {/* <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            /> */}
            <div className='flex justify-between items-center mb-2 drag_Handle'>
                <div className='font-mono text-xs mb-2 drag_Handle'>
                    Timer

                </div>
                <div className='mb-2 flex flex-col items-center drag_Handle'>
                    <div className='font-mono text-xs mb-1 text-center'>
                        loop
                    </div>
                    <input
                        type='checkbox'
                        checked={loop} // Bind the checked attribute to the loop state
                        onChange={(e) => { setLoop(e.target.checked) }} // Update loop based on checkbox's checked value
                    />

                </div>
            </div>
            <div className='flex'>
                <div className='w-[50%] mr-1'>
                    <input
                        value={timerInterval}
                        onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTimerInterval(e.target.value)
                        }}
                        id="interval"
                        name="interval"
                        type="number"
                        step='0.001'
                        min="0"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
                    />
                </div>
                <div className='w-[50%] drag_Handle'>
                    <Dropdown elements={mu} onChange={setSelected} />
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
            />
        </ div>
    );
});