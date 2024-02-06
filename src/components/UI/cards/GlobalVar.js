import React, { useContext, useEffect, useState } from 'react'
import fetchApi from '../../../utils/request/requests'
import ButtonMain from '../buttons/ButtonMain';
import { AppContext } from '../../../provider/appProvider';
import Confirm from '../../overlay/confirm';
import { AddRounded, DeleteRounded } from '@mui/icons-material';

export default function GlobalVar() {
    const { localServerUrl, localServerPort, setOverlay, setOverlayComponent, componentReload, setComponentReload } = useContext(AppContext);
    const [globalVars, setGlobalVars] = useState([])
    const [changedSettings, setChangedSettings] = useState({});
    const [reloadLocal, setReloadLocal] = useState(false)
    const [newGv, setNewGv] = useState("")



    const handleAddVariable = (e) => {
        e.preventDefault()

        async function addVar() {
            setOverlayComponent({
                Component: GlobalVar,
                props: {},
            });
            const data = { name: newGv }
            await fetchApi(
                "POST",
                localServerUrl,
                localServerPort,
                `nodes/globalvar`,
                data
            );
            setReloadLocal(!reloadLocal)
            setComponentReload(!componentReload)
        }

        setOverlay(true);
        setOverlayComponent({
            Component: Confirm,
            props: { children: "Do you want to Add this new global var?", onClick: addVar },
        });
    }


    const handleDeleteVariable = (e, name) => {
        e.preventDefault()

        async function delVar(name) {
            setOverlayComponent({
                Component: GlobalVar,
                props: {},
            });
            const data = { name: name }
            console.log(data)
            await fetchApi(
                "POST",
                localServerUrl,
                localServerPort,
                `nodes/globalvar/delete`,
                data
            );
            setReloadLocal(!reloadLocal)
        }

        setOverlay(true);
        setOverlayComponent({
            Component: Confirm,
            props: { children: "Do you want to Delete this new global var?", onClick: () => delVar(name) },
        });
    }



    const handleInputChange = (e) => {
        e.preventDefault()
        setNewGv(e.target.value)
    };



    useEffect(() => {
        fetchApi("GET", localServerUrl, localServerPort, `nodes/globalvar`).then(
            (response) => {
                setGlobalVars(response);
                setChangedSettings({});
            }
        );

    }, [, reloadLocal])

    return (
        <div>
            <form
                className="min-h-12 m-2 px-4 py-[9px] flex flex-col max-w-[600px] mx-auto rounded-lg shadow bg-white dark:bg-slate-800"
            >
                <div className="flex items-center w-full my-2 border-y">
                    <div className="flex items-center w-full font-helvetica dark:text-white">Name</div>
                    <div className="flex items-center w-full font-helvetica dark:text-white">Value</div>
                    <div className="flex items-center w-[80px] font-helvetica dark:text-white">Delete</div>
                </div>
                {Object.entries(globalVars).map(([key, value]) => (
                    <div className="flex items-center w-full  my-2 bg-gray-50 dark:text-white dark:bg-slate-800" key={key}>
                        <div className="flex items-center w-full font-helvetica dark:text-white">{key}</div>
                        <div className="flex items-center w-full font-helvetica dark:text-white">{value}</div>
                        <div className='px-3 cursor-pointer' onClick={(e) => handleDeleteVariable(e, key)}>
                            <DeleteRounded className='text-gray-700 dark:text-gray-300' />
                        </div>
                    </div>
                ))}

                <hr class="mt-4 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

                <div
                    className="flex items-center w-full py-4"
                >
                    <div className="flex items-center w-full font-mono dark:text-white">New Global Variable</div>
                    <input
                        required
                        value={newGv}
                        onChange={handleInputChange}
                        id={'newGv'}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
                    />
                    <div className='px-3 cursor-pointer' onClick={handleAddVariable}>
                        <AddRounded className='text-gray-700 dark:text-gray-300' />
                    </div>
                </div>


            </form>
        </div>
    )
}
