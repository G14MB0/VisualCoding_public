import React, { useContext, useEffect, useState } from "react";
import Dropdown from "../../components/UI/dropdown/Dropdown";
import ButtonMain from "../../components/UI/buttons/ButtonMain";
import fetchApi from "../../utils/request/requests";
import { AppContext } from "../../provider/appProvider";

export default function ConfigurationCardDAIO() {
  const { localServerUrl, localServerPort, setOverlay, setReload, reload } =
    useContext(AppContext);

  const [hardwares, setHardwares] = useState([]);

  const [selectedHardware, setSelectedHardware] = useState("");

  const [applicationChannel, setApplicationChannel] = useState(null);

  const [sampling, setSampling] = useState(500);

  //////////////////////////
  // Handler functions

  const handleHardwareChange = (e) => {
    setSelectedHardware(e);
  };

  const handleApplicationChannel = (e) => {
    setApplicationChannel(e.target.value);
  };

  const handleSamplingChange = (e) => {
    setSampling(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle your form submission logic here
    handleInitializeChannel();
  };

  const handleInitializeChannel = (e) => {
    const data = {
      serial_number: selectedHardware,
      frequency: sampling,
      ch_num: +applicationChannel - 1,
    };
    fetchApi(
      "POST",
      localServerUrl,
      localServerPort,
      `pythonbus/daio/start`,
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
      "pythonbus/availableHw/daio"
    ).then((response) => {
      response.length > 0
        ? setHardwares(response)
        : setHardwares(["Connect Hardware"]);
    });
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" min-h-12 shadow-custom rounded-lg m-2 px-4 py-[9px] flex flex-col bg-white "
      >
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">Hardware</div>
          <div className="flex items-center w-full">
            <Dropdown elements={hardwares} onChange={handleHardwareChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 my-1">
          <div className="flex items-center  w-full">App Channel</div>
          <div className="flex items-center w-full">
            <div className="w-full">
              <input
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
          <div className="flex items-center  w-full">Sampling</div>
          <div className="flex items-center w-full">
            <div className="w-full">
              <input
                required
                value={sampling}
                onChange={(e) => handleSamplingChange(e)}
                min="10"
                id="sampling"
                name="sampling"
                type="number"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
              />
            </div>
            <div className=" px-3 flex justify-center text-gray-500">ms</div>
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
