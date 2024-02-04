import React from 'react'
import TraceTable from './TraceTable'
import ConfigurationTableCan from "./ConfigurationTableCan"
import ConfigurationTableDAIO from "./ConfigurationTableDAIO"
import ConfigurationCardTasks from './ConfigurationCardTasks'

export default function Trace() {
    return (
        <div className='overflow-y-scroll scolatela h-[100vh] dark:bg-slate-900'>
            <div className=" w-full pt-10 grid grid-cols-11">
                <div className="col-span-6">
                    <ConfigurationTableCan />
                </div>
                <div className="col-span-5">
                    <ConfigurationTableDAIO />
                    <ConfigurationCardTasks />
                </div>
            </div>
            <div className='mb-20'>
                <TraceTable />
            </div>
        </ div>
    )
}
