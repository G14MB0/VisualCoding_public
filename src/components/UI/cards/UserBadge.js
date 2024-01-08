import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../../../provider/appProvider";
import { KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/20/solid";

export default function UserBadge() {

  const { userName, license } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  

  

  return (
      
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <UserCircleIcon className="h-6 z-100" color="grey"/>
      <Transition
        show={open}
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className=" z-20 absolute flex flex-col mt-1 max-h-56 right-4 top-12 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-3">
          <div className="flex items-center mb-4">
            <UserIcon className="h-6 w-6 text-gray-400 mr-2 z-20" />
            <h2 className="text-sm text-gray-600 truncate z-20"> {userName} </h2>
          </div>
          <div className="flex items-center mb-1">
            <KeyIcon className="h-6 w-6 text-gray-400 mr-2 z-20" />
            <p className="text-sm text-gray-600 z-20">{license ? license.split("%%").join(", ") : ""}</p>
          </div>
        </div>
      </Transition>
    </div>
  );
}


