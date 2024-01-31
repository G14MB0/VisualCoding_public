import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import SimpleEditor from '../../editor/SimpleEditor';
import { useContext } from 'react';
import { AppContext } from '../../../provider/appProvider';
import fetchApi from '../../../utils/request/requests';
import { useEffect } from 'react';



export default memo(({ data, isConnectable, updateNodeData }) => {

    const { setOverlay, setOverlayComponent, setSave, save, localServerUrl, localServerPort, sideBarReload, setSideBarReload, isDebug } = useContext(AppContext)
    const [code, setCode] = useState(data.code);
    const [name, setName] = useState("");

    const handleOpenEditor = (e) => {
        e.preventDefault();
        setOverlayComponent({
            Component: SimpleEditor,
            props: { code: code, setCode: setCode, onSave: handleSave }
        })
        setOverlay(true)
    }

    const handleSave = (e) => {
        e.preventDefault()
        setSave(!save)
    }

    const handleChangeName = (e) => {
        e.preventDefault()
        setName(e.target.value)
    }

    const handleSaveAsModel = (e) => {
        e.preventDefault()
        console.log(data)
        const temp = {
            name: name,
            type: "FunctionNode",
            style: data.style,
            data: { code: data.code },
            category: "Custom Function"
        }
        fetchApi("POST", localServerUrl, localServerPort, "functions/", temp).then(() => setSideBarReload(!sideBarReload))
    }
    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, code: code });

        }
    }, [updateNodeData, data.id, code]);


    return (


        <div className='nodeBase drag_Handle min-w-60' >
            <Handle
                type="target"
                position={Position.Left}
                id='a'
                isConnectable={isConnectable}
            />
            <div className='flex justify-between items-center mb-2'>
                <div className='font-mono text-xs mb-2'>
                    Function Node
                </div>
                <div className='font-mono text-xs mb-2 cursor-pointer' onClick={handleOpenEditor}>
                    Open Editor
                </div>
            </div>
            <pre className='bg-indigo-50 px-2 leading-3 py-2'><code className='font-mono text-xs font-[50]'>{code}</code></pre>
            <div className='flex justify-between items-center mt-2'>
                <form onSubmit={handleSaveAsModel} className='flex items-center mt-2'>
                    <div className='font-mono text-xs'>
                        <input
                            required
                            value={name}
                            onChange={(e) => { handleChangeName(e) }}
                            type="text"
                            className="block  rounded-md border-0 py-1 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                    </div>
                    <button type='submin' className='font-mono text-xs ml-2'>
                        Save as model
                    </button>
                </form>
            </div>
            <div className={`${isDebug ? "mt-4" : ""}`}>
                {isDebug ?
                    (<pre className='bg-indigo-50 px-2 leading-3 py-2'><code className='font-mono text-xs font-[50]'>{data.value && JSON.stringify(data.value, null, 2) && JSON.stringify(data.value, null, 2).replace(/\\n/g, '\n')}</code></pre>)
                    :
                    ""}
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