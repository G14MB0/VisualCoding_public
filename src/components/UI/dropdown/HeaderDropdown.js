import { Fragment, useContext, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { AppContext } from '../../../provider/appProvider';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function HeaderDropdown({ elements, onChange, deselect }) {


    // const [selected, setSelected] = useState(null)
    const [selected, setSelected] = useState(null);
    const [flag, setFlag] = useState(0);
    const [open, setOpen] = useState(false);


    useEffect(() => {
      setSelected(null)
    }, [deselect])
  

    useEffect(() => {
      if (selected) {
        onChange(selected)
      }
    }, [selected])

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="text-sm font-normal leading-6 text-gray-900 dark:text-white">
        <span className="flex items-center">
          <span className={`ml-3 block truncate ${selected && 'font-normal text-blue-700'}`}>{selected ? `Tools: ${selected}` : 'Tools'}</span>
        </span>
        {/* <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span> */}
      </button>

      <Transition
        show={open}
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute flex flex-col z-10 mt-1 max-h-56  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {elements && elements.map((element) => (
            <button
              key={element}
              className={classNames('relative cursor-pointer select-none py-2 pl-3 pr-9')}
              onClick={() => setSelected(element)}
            >
              <div className="flex items-center">
                <span className={classNames(element === selected ? 'font-semibold' : 'font-normal text-gray-500', 'ml-3 block truncate text-sm leading-6 ')}>
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
