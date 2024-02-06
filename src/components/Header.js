import { useContext, useEffect, useState } from "react";
import { AppContext } from "../provider/appProvider";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@headlessui/react";
import { Switch } from "@mui/material";
import fetchApi from "../utils/request/requests";
import { closeWs, openWs, startAllLog, startCanLog, stopAllLog } from "./flow/utils";
import { PlayArrowRounded, RefreshRounded, StopRounded } from "@mui/icons-material";
import Switcher from "./UI/Switcher";

const navigation_array = [
  { name: "Home", href: "#" },
  { name: "Studio", href: "#" },
  { name: "Settings", href: "#" },
];

export default function Header() {
  const { setOpenLogin, setOpenSignUp, setAppState, isLogged, setIsLogged, setIsDebug, appState, isRunning, localServerPort, localServerUrl, setActiveNode, setIsRunning, setGlobalWs, globalWs, isLogging, isDaioLogging } =
    useContext(AppContext);
  const [navigation, setNavigation] = useState(navigation_array);


  return (
    <header className="bg-background-light-alt dark:bg-slate-950 relative w-[100%] h-10 z-50">
      <nav
        className="mx-auto flex max-w-9xl items-center justify-between gap-x-4 p-0 px-3"
        aria-label="Global"
      >
        <div className="flex lg:flex"></div>
        {/* <div className="flex-1 lg:flex-1 h-8 w-auto drag" /> */}
        <div className="hidden lg:flex lg:gap-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              name={item.name}
              onClick={(e) => {
                setAppState(e.target.name);
              }}
              href={item.href}
              className={`text-sm leading-6 text-gray-900 dark:text-white ${item.name === appState ? 'font-semibold text-blue-500' : ''}`}

            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex-1 lg:flex-1 h-8 w-auto drag" />

        {/* <div className="flex-1 lg:flex-1 h-8 w-auto drag" /> */}

        <div className="flex items-center justify-end gap-x-6">

        </div>

        <div className="flex items-center font-mono text-xs dark:text-white">
          Debug Mode{" "}
          <div className="ml-1">
            <Switch className="custom-switch" onChange={(event) => setIsDebug(event.target.checked)} />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Switcher />
        </div>
        <div>
          {!isRunning
            ?
            <button className=''
              onClick={() => {
                fetchApi("GET", localServerUrl, localServerPort, "nodes/run");
                if (isLogging) {
                  if (isDaioLogging) {
                    startAllLog(localServerUrl, localServerPort);
                  } else {
                    startCanLog(localServerUrl, localServerPort);
                  }
                }
                openWs(localServerUrl, localServerPort, setGlobalWs, setActiveNode, setIsRunning);
                setIsRunning(true)
              }}>
              {!isRunning ?
                <PlayArrowRounded className='text-green-500' fontSize="large" />
                :
                <RefreshRounded className='text-gray-700 animate-spin1' />
              }
            </button>
            :
            <button className=''
              onClick={() => { fetchApi("GET", localServerUrl, localServerPort, "nodes/stop"); stopAllLog(localServerUrl, localServerPort); closeWs(globalWs, setGlobalWs);; setIsRunning(false) }}>
              <StopRounded className='text-red-700 animate-pulse' fontSize="large" />
            </button>
          }
        </div>
        <div className="flex ">
          <button
            id="minimizeApp"
            className="px-3  bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded"
          >
            <span className="sr-only">Minimize</span>
            &#x2013;
          </button>
          <button
            id="maximizeApp"
            className="px-3 mx-1 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded"
          >
            <span className="sr-only">Maximize</span>
            &#x25A1;
          </button>
          <button
            id="closeApp"
            className="px-3  bg-gray-400 hover:bg-red-600 active:bg-red-300 rounded "
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
      </nav>

    </header>
  );
}
