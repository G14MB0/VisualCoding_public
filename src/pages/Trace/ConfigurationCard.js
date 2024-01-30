import React, { useContext, useEffect, useState } from "react";
import Dropdown from "../../components/UI/dropdown/Dropdown";
import Switch from "@mui/material/Switch";
import ButtonMain from "../../components/UI/buttons/ButtonMain";
import ButtonSecondary from "../../components/UI/buttons/ButtonSecondary";
import fetchApi from "../../utils/request/requests";
import { AppContext } from "../../provider/appProvider";

export default function ConfigurationCard({ editing = false }) {
  const { localServerUrl, localServerPort, setOverlay, setReload, reload } =
    useContext(AppContext);

  const [hardwares, setHardwares] = useState([]);
  const [channels, setChannels] = useState([]);

  const [selectedHardware, setSelectedHardware] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");

  const [applicationChannel, setApplicationChannel] = useState(null);

  const [isFd, setIsFd] = useState(false);

  const [canBitRate, setCanBitRate] = useState(500);
  const [fdBitRate, setFdBitRate] = useState(2000);

  const [channelName, setChannelName] = useState("");
  const [dbPath, setDbPath] = useState("");

  // Up to now, used only msgId as "propagate" props
  const [msgId, setMsgId] = useState("");
  const [signalName, setSignalName] = useState("");

  //////////////////////////
  // Handler functions

  const handleHardwareChange = (e) => {
    setSelectedHardware(e.split("-").pop().trim());
  };

  const handleSelectedChannel = (e) => {
    setSelectedChannel(e);
  };

  const handleApplicationChannel = (e) => {
    setApplicationChannel(e.target.value);
  };

  const handleCanBitRateChange = (e) => {
    setCanBitRate(e.target.value);
  };

  const handleFdBitRateChange = (e) => {
    setFdBitRate(e.target.value);
  };

  const handleChannelNameChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleMsgIdChange = (e) => {
    setMsgId(e.target.value);
  };

  const handleSignalNameChange = (e) => {
    setSignalName(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle your form submission logic here
    handleInitializeChannel();
  };

  const handleInitializeChannel = (e) => {
    const data = {
      hw_channel: +selectedChannel - 1,
      serial_number: selectedHardware.split("-").pop().trim(),
      ch_num: +applicationChannel - 1,
      bitrate: canBitRate * 1000,
      fd: isFd,
      data_bitrate: fdBitRate * 1000,
      name: channelName,
      txtLog: false,
      db_path: dbPath,
      maxSize: 104857600,
      decode: true,
      propagate: msgId,
    };
    fetchApi(
      "POST",
      localServerUrl,
      localServerPort,
      `pythonbus/initialize`,
      data
    ).then((response) => {
      console.log(response);
      setOverlay(false);
      setReload(!reload);
    });
  };
  ////////////////////////////////
  // API fetch

  useEffect(() => {
    fetchApi(
      "GET",
      localServerUrl,
      localServerPort,
      "pythonbus/availableHw/can"
    ).then((response) => {
      response.length > 0
        ? setHardwares(response)
        : setHardwares(["Connect Hardware"]);
    });
  }, []);

  useEffect(() => {
    if (selectedHardware) {
      fetchApi(
        "GET",
        localServerUrl,
        localServerPort,
        `pythonbus/hwAvailableChannel/${selectedHardware}`
      ).then((response) => {
        response.length > 0 ? setChannels(response) : setChannels([-1]);
      });
    }
  }, [selectedHardware]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" min-h-12 shadow-custom rounded-lg m-2 px-4 py-[9px] flex flex-col bg-white "
      >
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">Hardware</div>
          <div className="flex items-center w-full">
            <Dropdown
              elements={hardwares}
              onChange={handleHardwareChange}
              disabled={editing}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">Hardware Channel</div>
          <div className="flex items-center w-full">
            <Dropdown
              elements={channels}
              onChange={handleSelectedChannel}
              disabled={editing}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">App Channel</div>
          <div className="flex items-center w-full">
            <div className="w-full">
              <input
                disabled={editing}
                required
                value={applicationChannel}
                onChange={(e) => handleApplicationChannel(e)}
                id="appChannel"
                name="appChannel"
                type="number"
                min="1"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">Bitrate</div>
          <div className="flex items-center w-full">
            <div className="w-full">
              <input
                disabled={editing}
                required
                value={canBitRate}
                onChange={(e) => handleCanBitRateChange(e)}
                id="canBitRate"
                name="canBitRate"
                type="number"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
              />
            </div>
            <div className=" px-3 flex justify-center text-gray-500">kB</div>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">
            FD{" "}
            <div className="ml-4">
              <Switch onChange={(event) => setIsFd(event.target.checked)} />
            </div>
          </div>
          <div className="flex items-center w-full">
            {isFd ? (
              <>
                <div className="w-full">
                  <input
                    disabled={editing}
                    value={fdBitRate}
                    onChange={(e) => handleFdBitRateChange(e)}
                    id="fdBitRate"
                    name="fdBitRate"
                    type="number"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
                  />
                </div>
                <div className=" px-3 flex justify-center text-gray-500">
                  kB
                </div>{" "}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">Channel Name</div>
          <div className="flex items-center w-full">
            <div className="w-full">
              <input
                disabled={editing}
                required
                value={channelName}
                onChange={(e) => handleChannelNameChange(e)}
                id="channelName"
                name="channelName"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">Database</div>
          {dbPath === "" ? (
            <div className="flex items-center w-full">
              <ButtonSecondary
                disabled={editing}
                children={"Select .dbc"}
                onClick={(e) => {
                  e.preventDefault();
                  fetchApi(
                    "GET",
                    localServerUrl,
                    localServerPort,
                    "tkinter/file/dbc"
                  )
                    .then((response) => {
                      setDbPath(response);
                    })
                    .catch((error) => {
                      // Handle any errors here
                      console.error("Error fetching data:", error);
                    });
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 font-mono text-xs w-[50%] hover:overflow-visible overflow-hidden">
                {dbPath?.split("/").pop()}
              </div>
              <div
                className="ml-1 flex items-center w-[40%]"
                onClick={(e) => {
                  if (!editing) {
                    e.preventDefault();
                    fetchApi(
                      "GET",
                      localServerUrl,
                      localServerPort,
                      "tkinter/file/dbc"
                    )
                      .then((response) => {
                        setDbPath(response);
                      })
                      .catch((error) => {
                        // Handle any errors here
                        console.error("Error fetching data:", error);
                      });
                  }
                }}
              >
                <ButtonSecondary children={"Select .dbc"} />
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1 items-center">
          <div className="flex w-full flex-col">Propagation</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="w-full col-span-3">
              <input
                value={msgId}
                onChange={(e) => handleMsgIdChange(e)}
                id="msgId"
                name="msgId"
                type="numeric"
                className="block w-full text-sm pl-6 flex justify-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>
            {/* <div className="w-full col-span-2">
            <input
              value={signalName}
              onChange={(e) => handleSignalNameChange(e)}
              id="signalName"
              name="signalName"
              type="text"
              className="block w-full text-sm pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
            />
          </div> */}
          </div>
        </div>
        <hr class="mt-4 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div className="flex justify-end">
          <div
            className="flex items-center m-2 w-[8%] text-gray-600 cursor-pointer"
            onClick={(e) => {
              setOverlay(false);
            }}
          >
            Close
          </div>
          <div className="flex items-center m-2 w-[15%]">
            <ButtonMain children={"Add"} type="submit" />
          </div>
        </div>
      </form>
    </>
  );
}
