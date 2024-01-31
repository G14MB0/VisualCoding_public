import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import SimpleEditor from '../../editor/SimpleEditor';
import { useContext } from 'react';
import { AppContext } from '../../../provider/appProvider';
import fetchApi from '../../../utils/request/requests';
import { useEffect } from 'react';



export default memo(({ data, isConnectable, updateNodeData }) => {


    return (


        <div className='nodeBase drag_Handle min-w-60 shadow' >
            <Handle
                type="target"
                id='a'
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
            <div className='flex justify-between items-center mb-2'>
                <div className='font-mono text-xs mb-2'>
                    Debugger Node
                </div>

            </div>
            <pre className='bg-indigo-50 px-2 leading-3 py-2'><code className='font-mono text-xs font-[50]'>{data.value && JSON.stringify(data.value, null, 2) && JSON.stringify(data.value, null, 2).replace(/\\n/g, '\n')}</code></pre>


        </ div>
    );
});