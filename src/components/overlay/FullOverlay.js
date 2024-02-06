import { Fragment, useContext } from "react";
import { Transition } from "@headlessui/react";
import { AppContext } from "../../provider/appProvider";
import { Close } from "@mui/icons-material";

export default function FullOverlay({ Component, ...props }) {
  const { overlay, setOverlay } = useContext(AppContext);



  return (
    <>
      <div
        aria-live="assertive"
        className={`z-[9999999] pointer-events-none fixed inset-0 flex items-end px-4 py-6 mt-[40px] sm:items-start sm:p-6 ${overlay ? "backdrop-blur-lg" : ""
          }`}
      >
        <div className="flex w-full h-[95%] flex-col items-center space-y-12 my-4">
          <Transition
            show={overlay}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* rounded-lg  shadow-lg ring-1 ring-black ring-opacity-5"> */}
            <div className="pointer-events-auto w-full h-full max-w-[70%]  overflow-x-hidden overflow-y-auto scolatela ">
              <div className="p-4 flex flex-col">
                <button
                  type="button"
                  className=" mb-5 flex justify-end rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    setOverlay(false);
                  }}
                >
                  <span className="sr-only">Close</span>
                  <Close
                    className="h-4 w-4  z-[999999999] rounded-full opacity-80 text-gray-900 dark:text-gray-50 "
                    aria-hidden="true"
                  />
                </button>
                {Component && <Component {...props} />}
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
