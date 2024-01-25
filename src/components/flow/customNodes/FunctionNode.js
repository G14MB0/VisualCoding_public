import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import SimpleEditor from '../../editor/SimpleEditor';
import { useContext } from 'react';
import { AppContext } from '../../../provider/appProvider';
import fetchApi from '../../../utils/request/requests';
import { useEffect } from 'react';



export default memo(({ data, isConnectable, updateNodeData }) => {

    const { setOverlay, setOverlayComponent, setSave, save } = useContext(AppContext)
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
            updateNodeData(data.id, { ...data, code: code });

        }
    }, [updateNodeData, data.id, code]);


    return (


        <div className='nodeBase min-w-60' >
            <Handle
                type="target"
                position={Position.Left}
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
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
            />
        </ div>
    );
});