import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useContext } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../../../provider/appProvider';



export default memo(({ data, isConnectable, updateNodeData }) => {

    const { setOverlay, setOverlayComponent, setSave, save, localServerUrl, localServerPort, sideBarReload, setSideBarReload } = useContext(AppContext)
    const [operation, setOperation] = useState(data.operation);
    const [name, setName] = useState("");


    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, operation: operation });

        }
    }, [updateNodeData, data.id, operation]);


    return (


        <div className='nodeSquare min-w-24' >
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: 20 }}
                isConnectable={isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ bottom: 15, top: 'auto' }}
                isConnectable={isConnectable}
            />
            <div className='flex justify-between items-center mb-2'>
                <div className='font-mono text-xs mb-2'>
                    Sum Node
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