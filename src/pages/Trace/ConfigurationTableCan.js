import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../provider/appProvider";
import fetchApi from "../../utils/request/requests";
import ConfigurationCard from "./ConfigurationCard";
import {
  AddCircleOutlineSharp,
  RemoveCircleOutlineSharp,
} from "@mui/icons-material";
import ConfigurationCardEdit from "./ConfigurationCardEdit";

export default function ConfigurationTableCan() {
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
    const data = {
      serial_number: element.serial_number,
      name: element.name,
      hw_channel: element.hw_channel,
    };
    fetchApi(
      "POST",
      localServerUrl,
      localServerPort,
      "pythonbus/deleteChannel",
      data
    ).then(() => {
      setReload(!reload);
    });
  };

  useEffect(() => {
    fetchApi(
      "GET",
      localServerUrl,
      localServerPort,
      `pythonbus/canchannel`
    ).then((response) => {
      console.log(response);
      setActiveHw(response);
    });
  }, [reload]);

  return (
    <>
      <div className="text-[12px] text-gray-900 font-mono ml-4">
        Active CAN Channel
      </div>
      <div className=" min-h-12 shadow-custom2 rounded-lg my-1 px-4 mx-4 py-[9px] flex flex-col bg-white overflow-auto scolamela">
        <table className="overflow-scroll">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono"
              >
                Hardware
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono"
              >
                Channel
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 font-mono"
              >
                App Channel
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 ">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white max-h-[300px] overflow-auto">
            {activeHw &&
              activeHw.map((element, key) => (
                <tr
                  key={key}
                  className={
                    key % 2 === 0
                      ? "cursor-pointer hover:bg-indigo-100"
                      : "bg-gray-100 cursor-pointer hover:bg-indigo-100"
                  }
                  onClick={(e) => {
                    if (!isRunning) {
                      e.stopPropagation();
                      e.preventDefault();
                      setOverlay(true);
                      setOverlayComponent({
                        Component: ConfigurationCardEdit,
                        props: {
                          hardware: element.serial_number,
                          channel: element.hw_channel,
                          appChannel: element.ch_num,
                          bitRate: element.bitrate,
                          isFd: element.fd,
                          fdBitrate: element.data_bitrate,
                          channelName: element.name,
                          dbPath: element.dbPath,
                          propagation: element.propagation,
                        },
                      });
                    }
                  }}
                >
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["name"]}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["serial_number"]}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["hw_channel"] + 1}
                  </td>
                  <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 ">
                    {element["ch_num"] + 1}
                  </td>
                  <td
                    className={`whitespace-nowrap py-2 px-3 text-sm  w-4 h-4  ${
                      isRunning
                        ? "cursor-not-allowed text-gray-300"
                        : "text-gray-900 cursor-pointer"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveChannel(element);
                    }}
                  >
                    <RemoveCircleOutlineSharp
                      className="text-gray-500 hover:text-red-700"
                      fontSize="small"
                    />
                  </td>
                </tr>
              ))}
            <tr>
              <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
              <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
              <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
              <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "></td>
              <td
                className={`whitespace-nowrap py-2 px-3 text-sm  w-4 h-4  ${
                  isRunning
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-900 cursor-pointer"
                }`}
                onClick={(e) => {
                  if (!isRunning) {
                    setOverlay(true);
                    setOverlayComponent({
                      Component: ConfigurationCard,
                      props: {},
                    });
                  }
                }}
              >
                <AddCircleOutlineSharp
                  className="text-gray-500 hover:text-green-700"
                  fontSize="small"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}