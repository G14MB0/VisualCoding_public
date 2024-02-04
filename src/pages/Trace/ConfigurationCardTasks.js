import React, { useContext, useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import fetchApi from "../../utils/request/requests";
import { AppContext } from "../../provider/appProvider";


export default function ConfigurationCardTasks() {
  const {
    setIsLogging, setIsDaioLogging, isRunning
  } = useContext(AppContext);


  const [logName, setLogName] = useState("");

  //////////////////////////
  // Handler functions



  const handleNameChange = (e) => {
    setLogName(e.target.value);
  };

  return (
    <>
      <div className="text-[12px] text-gray-900 font-mono ml-4 pt-2 dark:text-white ">
        Log Configuration
      </div>
      <div
        className="  shadow-custom2 rounded-lg my-1 px-4 mx-4 py-[9px] flex flex-col bg-white overflow-initial dark:bg-slate-900 dark:shadow-custom2white hover:brightness-[1.2]"
      >
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          {/* <div
            className="flex items-center px-3 w-full text-sm  text-gray-900 font-mono"
            title="The total number of days the test should last"
          >
            Log File Name
          </div>
          <div className="flex items-center w-full">
            <input
              disabled={isRunning}
              required
              value={logName}
              onChange={(e) => handleNameChange(e)}
              id="logname"
              name="logname"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
            />
          </div> */}
          <div className="flex items-center justify-between w-full col-span-2">
            <div
              className="flex items-center px-3 w-full text-sm  text-gray-900 font-mono dark:text-white"
              title="The total number of days the test should last"
            >
              DAIO log{" "}
              <div className="ml-4">
                <Switch disabled={isRunning} className="custom-switch" onChange={(event) => setIsDaioLogging(event.target.checked)} />
              </div>
            </div>
            <div
              className="flex items-center px-3 w-full text-sm  text-gray-900 font-mono dark:text-white"
              title="The total number of days the test should last"
            >
              Enable log{" "}
              <div className="ml-4">
                <Switch disabled={isRunning} className="custom-switch" onChange={(event) => setIsLogging(event.target.checked)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
