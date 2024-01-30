import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useContext } from 'react';
import { useEffect } from 'react';
import Dropdown from '../../../UI/dropdown/Dropdown';
import { AppContext } from '../../../../provider/appProvider';
import fetchApi from '../../../../utils/request/requests';
import { PublicRounded } from '@mui/icons-material';


const keyPlaceholder = '${key}';

const initialPythonCode = `async def FunctionGlobalVar(data):
    if data:
        gv.globalVarDict["${keyPlaceholder}"] = data
        await gv.putGlobalValue({"${keyPlaceholder}": data})
        return data
    else:
        return gv.globalVarDict["${keyPlaceholder}"]`;

export default memo(({ data, isConnectable, updateNodeData }) => {

    const { localServerUrl, localServerPort, reload, componentReload } = useContext(AppContext)
    const [code, setCode] = useState(data.code);
    const [replacementKey, setReplacementKey] = useState(data.replacementKey);
    const [reloadLocal, setReloadLocal] = useState(false)
    const [globalVars, setGlobalVars] = useState([])


    // Call updateNodeData whenever selected changes
    useEffect(() => {
        const finalPythonCode = initialPythonCode.replaceAll(keyPlaceholder, replacementKey);
        if (updateNodeData) {
            updateNodeData(data.id, { ...data, code: finalPythonCode, replacementKey: replacementKey });

        }
    }, [updateNodeData, data.id, replacementKey]);


    useEffect(() => {
        fetchApi("GET", localServerUrl, localServerPort, `nodes/globalvar`).then(
            (response) => {
                setGlobalVars(Object.keys(response));
            }
        );

    }, [, reload, componentReload])


    return (


        <div className='nodeFree h-24 w-28 drag_Handle flex flex-col justify-around items-center' >
            <Handle
                type="target"
                position={Position.Left}
                id='a'
                isConnectable={isConnectable}
            />
            <div className='flex justify-center items-center'>
                <PublicRounded />
            </div>
            <div className='flex  justify-between items-center mb-2 mt-2'>
                <Dropdown elements={globalVars} onChange={setReplacementKey} elementSelected={replacementKey} />
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