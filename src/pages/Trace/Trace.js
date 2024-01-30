import React from 'react'
import TraceTable from './TraceTable'
import ConfigurationTableCan from "./ConfigurationTableCan"
import ConfigurationTableDAIO from "./ConfigurationTableDAIO"

export default function Trace() {
    return (
        <>
            <div className=" w-full h-full pt-10 grid grid-cols-11">
                <div className="col-span-6">
                    <ConfigurationTableCan />
                </div>
                <div className="col-span-5">
                    <ConfigurationTableDAIO />
                </div>
            </div>
            <div>
                <TraceTable />
            </div>
        </>
    )
}
