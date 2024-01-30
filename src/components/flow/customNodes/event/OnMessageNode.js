import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import fetchApi from '../../../../utils/request/requests';




export default memo(({ data, isConnectable, updateNodeData }) => {

    const [propagatedSignal, setPropagatedSignal] = useState("250.OperationalModeSts")
    const [allPropagated, setAllPropagated] = useState([])
    // const [propagatedSignal, setPropagatedSignal] = useState(data.propagatedSignal)
    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, propagatedSignal: propagatedSignal });
        }
    }, [updateNodeData, data.id, propagatedSignal]);

    useEffect(() => {
        fetchApi
    }, [, componentReload])



    return (
        <div className='nodeBase'>
            {/* <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            /> */}
            <div className='flex justify-between items-center mb-2 drag_Handle'>
                <div className='font-mono text-xs mb-2 drag_Handle'>
                    On Message
                </div>

            </div>
            <div className='flex'>
                {/* <div className='w-[50%] mr-1'>
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
                </div> */}
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