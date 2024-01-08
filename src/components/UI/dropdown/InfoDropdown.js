import { Fragment, useContext, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { AppContext } from '../../../provider/appProvider';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function InfoDropdown({ elements }) {


    const [open, setOpen] = useState(false);


  

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="h-6 w-6">
        <ChatBubbleBottomCenterIcon />
      </button>

      <Transition
        show={open}
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute left-24 flex flex-col z-10 mt-1 max-h-56  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {elements && elements.map((element) => (
            <button
              key={element}
              className={classNames('relative cursor-pointer select-none py-2 pl-3 pr-9')}
              onClick={() => setSelected(element)}
            >
              <div className="flex items-center">
                <span className={classNames('font-normal text-gray-500', 'ml-3 block truncate text-sm leading-6 ')}>
                  {element}
                </span>
              </div>

            </button>
          ))}
        </div>
      </Transition>
    </div>
  )
}
