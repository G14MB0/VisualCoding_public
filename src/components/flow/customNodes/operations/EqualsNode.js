import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useContext } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../../../../provider/appProvider';
import { BalanceRounded, ContentCutRounded } from '@mui/icons-material';



export default memo(({ data, isConnectable, updateNodeData }) => {

    const { } = useContext(AppContext)
    const [operation, setOperation] = useState(data.operation);

    // Call updateNodeData whenever selected changes
    useEffect(() => {
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, operation: "equals" });

        }
    }, [updateNodeData, data.id, operation]);


    return (


        <div className='nodeSquare flex justify-center items-center' >
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
                <BalanceRounded fontSize='large' />
            </div>

            <Handle
                type="source"
                style={{ top: 15 }}
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                style={{ bottom: 10, top: 'auto', }}
                position={Position.Right}
                id="b"
                isConnectable={isConnectable}
            />
        </ div>
    );
});