import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../provider/appProvider";
import fetchApi from "../../utils/request/requests";
import ButtonMain from "../../components/UI/buttons/ButtonMain";
import Confirm from "../../components/overlay/confirm";
import ButtonSecondary from "../../components/UI/buttons/ButtonSecondary";
import { FolderCopyOutlined, ListAlt, Settings } from "@mui/icons-material";

const titleArray = {
  EMAIL: "Insert all the email separated by a comma (,)",
  CHART_SAMPLE_UPDATE: "Value in seconds [s]",
  CURRENT:
    "Insert the propagation value that will be used to calculate the average current in report. This must be also inserted in the CAN channel",
  VOLTAGE:
    "Insert the propagation value that will be used to calculate the average voltage in report. This can be anything",
  MAX_LOG_SIZE: "Insert the maximum log file size in bytes [b]",
  VOLTAGE_MSG_ID:
    "This will be the message ID that will be used to add the voltage value in the CAN log",
  EMAIL_OBJECT:
    "the email object. Available variables: \n{info} \n {currentName} \n {voltageName} \n\n standard Python3 package modules available.",
  EMAIL_TEMPLATE:
    "Path of the email template. See docs to know how to edit or create a new template",
};

export default function Setting() {
  const {
    localServerUrl,
    localServerPort,
    setOverlay,
    setOverlayComponent,
  } = useContext(AppContext);

  const [settings, setSettings] = useState({});
  const [changedSettings, setChangedSettings] = useState({});

  // const handleSendTemplate = (e) => {
  //   setOverlay(true);
  //   setOverlayComponent({
  //     Component: Confirm,
  //     props: {
  //       children: "Do you want to send the email?",
  //       onClick: sendTemplate,
  //     },
  //   });
  // };

  // const sendTemplate = (e) => {
  //   e.preventDefault();
  //   const data = { info: "***** This is a template *****" };
  //   fetchApi("POST", localServerUrl, localServerPort, `setting/template`, data);
  //   setOverlay(false);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    // Handle your form submission logic here
    setOverlay(true);
    setOverlayComponent({
      Component: Confirm,
      props: { children: "Do you want to Update settings?", onClick: Submit },
    });
  };

  const Submit = async (e) => {
    e.preventDefault();

    for (const [name, value] of Object.entries(changedSettings)) {
      const data = { name, value };
      try {
        const response = await fetchApi(
          "POST",
          localServerUrl,
          localServerPort,
          `setting`,
          data
        );
        // Update initialSettings with the response for this particular setting
        setSettings((prevSettings) => ({
          ...prevSettings,
          [name]: response[name],
        }));
      } catch (error) {
        // Handle error for this particular request
        console.error(`Error updating setting ${name}:`, error);
        // Optionally, break the loop if one update fails
        // break;
      }
    }
    setOverlay(false);
    // Reset changedSettings after all updates are made
    setChangedSettings({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (settings[name] !== value) {
      setChangedSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    } else {
      // If the value is changed back to the initial, remove it from changedSettings
      setChangedSettings((prevSettings) => {
        const newSettings = { ...prevSettings };
        delete newSettings[name];
        return newSettings;
      });
    }
  };

  useEffect(() => {
    fetchApi("GET", localServerUrl, localServerPort, `setting`).then(
      (response) => {
        setSettings(response);
        setChangedSettings({});
      }
    );
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="w-full px-5 mt-4 mb-4 border-y h-8 flex items-center justify-end">
        <FolderCopyOutlined
          className="font-sm text-gray-500 cursor-pointer mx-1"
          fontSize="small"
          titleAccess={"open log folder"}
          onClick={(e) => {
            e.preventDefault();
            fetchApi(
              "GET",
              localServerUrl,
              localServerPort,
              `tkinter/openfolder/log`
            );
          }}
        />

        <Settings
          className="font-sm text-gray-500 cursor-pointer mx-1"
          fontSize="small"
          titleAccess={"open setting file folder"}
          onClick={(e) => {
            e.preventDefault();
            fetchApi(
              "GET",
              localServerUrl,
              localServerPort,
              `tkinter/openfolder/config`
            );
          }}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="min-h-12 m-2 px-4 py-[9px] flex flex-col bg-white"
      >
        {Object.entries(settings).map(([key, value]) => (
          <div className="grid grid-cols-2 w-full gap-4 my-1" key={key}>
            <div className="flex items-center w-full font-mono">{key}</div>
            <div
              className="flex items-center w-full"
              // title={
              //   key === "EMAIL"
              //     ? "Insert all the email separated by a comma (,)"
              //     : ""
              // }
              title={titleArray[key] && titleArray[key]}
            >
              {key === "EMAIL" ? (
                <textarea
                  required
                  value={changedSettings[key] ?? value}
                  onChange={handleInputChange}
                  id={key}
                  name={key}
                  className="block w-full resize-y rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
                />
              ) : (
                <input
                  required
                  value={changedSettings[key] ?? value}
                  onChange={handleInputChange}
                  id={key}
                  name={key}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-6"
                />
              )}
            </div>
          </div>
        ))}
        <hr class="mt-4 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

        <div className=" w-full flex justify-end">
          <div className="w-36 mt-4 mr-4">
            {/* <ButtonSecondary
              onClick={handleSendTemplate}
              children={"send email template"}
            /> */}
          </div>
          <div className="w-24 mt-4">
            <ButtonMain children={"Update"} type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}
