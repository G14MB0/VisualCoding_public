import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

import Dropdown from '../../UI/dropdown/Dropdown'

const mu = ["m", "h", "d"];


export default memo(({ data, isConnectable }) => {
    const [selected, setSelected] = useState(mu[0])
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div>
                Custom Color Picker Node: <strong>{data.color}</strong>
            </div>
            <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
            <Dropdown elements={mu} onChange={setSelected} />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{ bottom: 10, top: 'auto', background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
});