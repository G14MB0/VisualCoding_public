import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../provider/appProvider";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import Dropdown from "../../components/UI/dropdown/Dropdown";


const tableHeader = ["Bus", "ID", "Raw value"]
const columnIndexMap = {
  "ID": 0,
  "Raw value": 1,
  // Assuming "Bus" corresponds to another property like "canBus"
  // "Bus": 2 // or the correct index for "Bus"
};

export default function TraceTable() {
  const { localServerUrl, localServerPort } = useContext(AppContext);
  const [messages, setMessages] = useState(null); // maybe to be modified
  const [ws, setWs] = useState(null);

  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState(
    tableHeader[0]
  );

  // Used for accordion opening
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen((prevOpen) => (prevOpen === value ? null : value));
  };

  const handleDropdownChange = (value) => {
    setSearchColumn(value);
  };

  const transformData = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };

      Object.keys(newMessage).forEach((canBus) => {
        newMessage[canBus].forEach((msg) => {
          const { msgId, ...msgData } = msg;

          if (updatedMessages[canBus]) {
            const existingIndex = updatedMessages[canBus].findIndex(
              (m) => m.msgId === msgId
            );
            if (existingIndex !== -1) {
              // Update only the existing message
              updatedMessages[canBus][existingIndex] = {
                ...updatedMessages[canBus][existingIndex],
                ...msgData,
              };
            } else {
              // Add the new message
              updatedMessages[canBus] = [
                ...updatedMessages[canBus],
                { msgId, ...msgData },
              ];
            }
          } else {
            // Create new canBus entry
            updatedMessages[canBus] = [{ msgId, ...msgData }];
          }
        });
      });

      return updatedMessages;
    });

    return;
  };

  function openWs() {
    // Initialize the WebSocket connection
    if (ws) {
      return;
    }
    const webSocket = new WebSocket(
      `ws://${localServerUrl}:${localServerPort}/pythonbus/ws/start`
    ); // Replace with your WebSocket URL
    webSocket.onopen = () => {
      console.log("WebSocket Connected");
    };
    webSocket.onmessage = (event) => {
      // Assuming the message is JSON
      try {
        const newMessage = JSON.parse(event.data);
        transformData(newMessage);
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };
    webSocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
    webSocket.onclose = () => {
      console.log("WebSocket Disconnected");
    };
    // Set the WebSocket in state
    setWs(webSocket);

    // Clean up on unmount
    return () => {
      webSocket.close();
    };
  }

  function closeWs() {
    if (ws) {
      ws.close();
      setWs(null);
      setMessages(null);
    }
  }

  useEffect(() => {
    {
      // messages && console.log(messages);
      // messages &&
      //   Object.keys(messages).forEach((canBus) => {
      //     {
      //       Object.entries(messages[canBus][0]).map((msg, key) =>
      //         console.log(msg[1])
      //       );
      //     }
      //   });

    }
  }, [messages]);

  const columns = tableHeader;

  return (
    <div className="px-4 mx-auto my-8 ">
      <div className="flex w-full justify-end items-center my-4">
        <div className="cursor-pointer mr-1" onClick={openWs}>
          <PlayArrowRounded className="text-gray-700" />
        </div>
        <div className="cursor-pointer" onClick={closeWs}>
          <PauseRounded className="text-gray-700" />
        </div>
      </div>
      {messages &&
        <>
          <div className="grid grid-cols-6 pb-2 ml-1">
            <input
              className="col-span-3 relative h-[36px] my-auto rounded-md bg-white py-1.5 pl-3 mr-2 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by ${searchColumn}`}
            />
            <div className="col-span-3 mr-2 my-auto">
              <Dropdown
                elements={columns}
                onChange={handleDropdownChange}
              />
            </div>
          </div>
        </>
      }

      <div className={`grid grid-cols-${tableHeader.length}`}>
        {messages && tableHeader.map((value, key) => (
          <>
            <div className="font-mono pl-1">{value}</div>
            {/* <div className="font-mono">msg ID</div> */}
            {/* <div className="font-mono">msg Value [hex]</div> */}
          </>
        ))}
      </div>

      {
        messages &&
        Object.keys(messages).map((canBus, key) =>
          Object.entries(messages[canBus][0]).map(
            (msg, entryIndex) =>
              msg[0] !== "msgId" && (
                <Accordion key={entryIndex} open={open === entryIndex}
                  style={{
                    display:
                      !search ||
                        (msg[columnIndexMap[searchColumn]] &&
                          msg[columnIndexMap[searchColumn]]
                            .toLowerCase()
                            .includes(
                              search.toLowerCase()
                            ))
                        ? ""
                        : searchColumn === "Bus" ? (
                          canBus
                            .toLowerCase()
                            .includes(
                              search.toLowerCase()
                            ))
                          ? "" : "none" : "none"
                  }}
                >
                  <AccordionHeader
                    onClick={() => handleOpen(entryIndex)}
                    className={`py-1 ${open === entryIndex &&
                      typeof msg[1] === "object" &&
                      msg[1] !== null
                      ? "bg-indigo-200" // Open accordion header color
                      : entryIndex % 2 === 0
                        ? "bg-indigo-50" // Even accordion header color
                        : "bg-indigo-100" // Odd accordion header color
                      }`}
                  >
                    <>
                      <div className="whitespace-nowrap  px-3 text-xs font-mono font-light text-gray-900 w-1/3">
                        {canBus}
                      </div>
                      <div className="whitespace-nowrap px-3 text-xs font-mono font-light text-gray-900 w-1/3">
                        {msg[0]}
                      </div>
                      <div className="whitespace-nowrap px-3 text-xs font-mono font-light text-gray-900 w-1/3">
                        {msg[1] &&
                          (typeof msg[1] === "object" && msg[1] !== null && msg[1]["__debugData"]
                            ? JSON.stringify(msg[1]["__debugData"]["rawMessageValue"] ?? "")
                            : JSON.stringify(msg[1] ?? "")
                          )
                            .replace(/^"|"$/g, "") // Remove enclosing quotes from JSON string
                            .match(/.{2}/g)
                            ?.join(" ")}
                      </div>
                    </>
                  </AccordionHeader>
                  {typeof msg[1] === "object" && msg[1] !== null && (
                    <AccordionBody className="pt-2">
                      <div className="grid grid-cols-2">
                        <div className="mb-auto">
                          <table className="table-auto divide-y ml-12">
                            <thead>
                              <tr>
                                <th
                                  className="px-4 pb-2"
                                  style={{
                                    textAlign: "left",
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  Signal Name
                                </th>
                                <th
                                  className="px-4 pb-2"
                                  style={{
                                    textAlign: "left",
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(msg[1])
                                .filter(([key, value], index) => !["__debugData", "rawMessageValue", "msgTimeStamp", "receivedFromChannelName", "msgID"].includes(key))
                                .map(([key, value], index) => (
                                  <tr key={index}>
                                    <td className="px-4">{key}</td>
                                    <td className="px-4">{value.toString()}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mb-auto">
                          <table className=" divide-y ml-12">
                            <thead>
                              <tr>
                                <th
                                  className="px-4 pb-2"
                                  style={{
                                    textAlign: "left",
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  Additonal Info
                                </th>
                                <th
                                  className="px-4 pb-2"
                                  style={{
                                    textAlign: "left",
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  Value
                                </th>
                              </tr>
                            </thead>
                            {/* <tbody>
                              {Object.entries(msg[1])
                                .filter(([key, value], index) => ["rawMessageValue", "msgTimeStamp", "receivedFromChannelName", "msgID"].includes(key))
                                .map(([key, value], index) => (
                                  <tr key={index}>
                                    <td className="px-4">{key}</td>
                                    <td className="px-4">{value.toString()}</td>
                                  </tr>
                                ))}
                            </tbody> */}
                            <tbody>
                              {msg[1] && msg[1].__debugData &&
                                Object.entries(msg[1].__debugData).map(([key, value], index) => (
                                  <tr key={index}>
                                    <td className="px-4">{key}</td>
                                    <td className="px-4">{value.toString()}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </AccordionBody>
                  )}
                </Accordion>
              )
          )
        )
      }
      {/* {messages &&
        Object.keys(messages).map((canBus) => (
          <table
            key={canBus}
            className="w-full table-fixed overflow-scroll scolatela divide-y divide-gray-300 "
          >
            <thead className="sticky top-0 bg-white">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  BUS
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  HEX VALUE
                </th>
              </tr>
            </thead>

            <tbody className="bg-white max-h-[300px] overflow-auto">
              {Object.entries(messages[canBus][0]).map(
                (msg, key) =>
                  msg[0] !== "msgId" && (
                    <tr
                      key={key}
                      className={key % 2 === 0 ? "" : "bg-gray-100"}
                    >
                      <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 w-1/2">
                        {canBus}
                      </td>
                      <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 w-1/2">
                        {msg[0]}
                      </td>
                      <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 w-1/2">
                        {msg[1] && JSON.stringify(msg[1]["rawMessageValue"])}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        ))} */}
    </div >
  );
}
