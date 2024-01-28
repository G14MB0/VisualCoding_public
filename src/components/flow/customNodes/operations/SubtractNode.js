import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useContext } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../../../provider/appProvider';
import { RemoveRounded } from '@mui/icons-material';



export default memo(({ data, isConnectable, updateNodeData }) => {

    const { } = useContext(AppContext)
    const [operation, setOperation] = useState(data.operation);

    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, operation: "subtract" });

        }
    }, [updateNodeData, data.id, operation]);


    return (


        <div className='nodeSquare drag_Handle flex justify-center items-center' >
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: 15 }}
                id="a"
                isConnectable={isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ bottom: 10, top: 'auto', }}
                id="b"
                isConnectable={isConnectable}
            />
            <div className='flex justify-center items-center'>
                <RemoveRounded fontSize='large' />
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