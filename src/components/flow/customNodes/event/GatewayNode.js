import React, { memo, useContext, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import fetchApi from '../../../../utils/request/requests';
import { AppContext } from '../../../../provider/appProvider';
import Dropdown from '../../../UI/dropdown/Dropdown';




export default memo(({ data, isConnectable, updateNodeData }) => {

    const { componentReload, localServerUrl, localServerPort, isDebug } = useContext(AppContext)
    const [source, setSource] = useState(data.source)
    const [target, setTarget] = useState(data.target)
    const [allChannel, setAllChannel] = useState([])
    // const [propagatedSignal, setPropagatedSignal] = useState(data.propagatedSignal)
    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, source: source, target: target });
        }
    }, [updateNodeData, data.id, source, target]);

    useEffect(() => {
        fetchApi("GET", localServerUrl, localServerPort, "pythonbus/canchannel").then((response) =>
            setAllChannel(Object.entries(response).map(([index, value], key) => { return value.name }))
        )
    }, [, componentReload])



    return (
        <div className='nodeBase min-w-60'>
            {/* <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            /> */}
            <div className='flex justify-between items-center mb-2 drag_Handle'>
                <div className='font-mono text-xs mb-2 drag_Handle'>
                    Message Forwarding(Gateway)
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
                </div>*/}
                <div className='w-full drag_Handle'>
                    <Dropdown elements={allChannel} onChange={setSource} elementSelected={data.source} />
                </div>
                <div className='w-full drag_Handle pl-2'>
                    <Dropdown elements={allChannel} onChange={setTarget} elementSelected={data.target} />
                </div>
            </div>
            <div className={`${isDebug ? "mt-4" : ""}`}>
                {isDebug ?
                    (<pre className='bg-indigo-50 px-2 leading-3 py-2'><code className='font-mono text-xs font-[50]'>{data.value && JSON.stringify(data.value, null, 2) && JSON.stringify(data.value, null, 2).replace(/\\n/g, '\n')}</code></pre>)
                    :
                    ""}
            </div>
        </ div>
    );
});