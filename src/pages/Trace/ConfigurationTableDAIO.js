import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../provider/appProvider";
import fetchApi from "../../utils/request/requests";
import {
  AddCircleOutlineSharp,
  RemoveCircleOutlineSharp,
} from "@mui/icons-material";
import ConfigurationCardDAIO from "./ConfigurationCardDAIO";

export default function ConfigurationTableDAIO() {
  const {
    reload,
    localServerUrl,
    localServerPort,
    setOverlay,
    setReload,
    setOverlayComponent,
    isRunning,
  } = useContext(AppContext);

  const [activeHw, setActiveHw] = useState([]);

  const handleRemoveChannel = (element) => {
    fetchApi(
      "GET",
      localServerUrl,
      localServerPort,
      "pythonbus/daio/stop"
    ).then(() => {
      setReload(true);
    });
  };

  useEffect(() => {
    if (reload) {
      fetchApi("GET", localServerUrl, localServerPort, `pythonbus/daiochannel`)
        .then((response) => {
          setActiveHw(response);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          // Handle the error further (e.g., show an error message to the user)
        });
    }
    setReload(false)
  }, [reload]);

  return (
    <>
      <div className="text-[12px] text-gray-900 font-mono ml-4 dark:text-white">
        Active DAIO Channel
      </div>
      <div className=" min-h-12 shadow-custom2 rounded-lg my-1 px-4 mx-4 py-[9px] flex flex-col bg-white overflow-auto scolamela dark:bg-slate-900 hover:brightness-[1.2] dark:shadow-custom2white">
        <table className="overflow-scroll">
          <thead className="sticky top-0 ">
            <tr>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono dark:text-white"
              >
                Hardware
              </th>

              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono dark:text-white"
              >
                App Channel
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono dark:text-white"
              >
                Sampling [ms]
              </th>

              <th scope="col" className="relative py-3.5 pl-3 pr-4 ">
                <span className="sr-only dark:text-white">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className=" max-h-[300px] overflow-auto">
            {activeHw.length > 0 ? (
              activeHw.map((element, key) => (
                <tr key={key} className={key % 2 === 0 ? "dark:hover:bg-slate-700" : "bg-gray-100 dark:hover:bg-slate-700"}>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["serial_number"]}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["ch_num"] + 1}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["frequency"]}
                  </td>
                  <td
                    className={`whitespace-nowrap py-2 px-3 text-sm  w-4 h-4  ${isRunning
                      ? "cursor-not-allowed text-gray-300"
                      : "text-gray-900 cursor-pointer"
                      }`}
                    onClick={() => {
                      if (!isRunning) {
                        handleRemoveChannel(element);
                      }
                    }}
                  >
                    <RemoveCircleOutlineSharp
                      className="text-gray-500 hover:text-red-700"
                      fontSize="small"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
                <td
                  className={`whitespace-nowrap py-2 px-3 text-sm  w-4 h-4  ${isRunning
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-900 cursor-pointer "
                    }`}
                  onClick={(e) => {
                    if (!isRunning) {
                      e.preventDefault();
                      setOverlay(true);
                      setOverlayComponent({
                        Component: ConfigurationCardDAIO,
                        props: {},
                      });
                    }
                  }}
                >
                  <AddCircleOutlineSharp
                    className={`text-gray-500 ${isRunning ? "" : "hover:text-green-700"
                      }`}
                    fontSize="small"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
