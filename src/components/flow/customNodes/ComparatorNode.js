import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import SimpleEditor from '../../editor/SimpleEditor';
import { useContext } from 'react';
import { AppContext } from '../../../provider/appProvider';
import fetchApi from '../../../utils/request/requests';
import { useEffect } from 'react';



export default memo(({ data, isConnectable, updateNodeData, connectedNodes = {} }) => {

    const { setOverlay, setOverlayComponent, setSave, save, isDebug } = useContext(AppContext)
    const [code, setCode] = useState(data.code);

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

    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, {
                ...data, code,
                connectedNodes: {
                    a: connectedNodes.a, // ID of the node connected to the first output
                    b: connectedNodes.b  // ID of the node connected to the second output
                }
            });

        }
    }, [updateNodeData, data.id, code, connectedNodes.a, connectedNodes.b]);


    return (


        <div className='nodeBase drag_Handle min-w-60' >
            <Handle
                type="target"
                id="a"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <div className='flex justify-between items-center mb-2'>
                <div className='font-mono text-xs mb-2'>
                    Comparator Node
                </div>
                <div className='font-mono text-xs mb-2 cursor-pointer' onClick={handleOpenEditor}>
                    Open Editor
                </div>
            </div>
            <pre className='bg-indigo-50 px-2 leading-3 py-2'><code className='font-mono text-xs font-[50]'>{code}</code></pre>
            <div className={`${isDebug ? "mt-4" : ""}`}>
                {isDebug ?
                    (<pre className='bg-indigo-50 px-2 leading-3 py-2'><code className='font-mono text-xs font-[50]'>{JSON.stringify(data.value, null, 2).replace(/\\n/g, '\n')}</code></pre>)
                    :
                    ""}
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: 20 }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{ bottom: 15, top: 'auto' }}
                isConnectable={isConnectable}
            />
        </ div>
    );
});