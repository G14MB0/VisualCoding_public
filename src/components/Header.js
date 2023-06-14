import { useContext, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AppContext } from "../provider/appProvider";


const navigation_array = [
  { name: "Home", href: "#" },
  { name: "Studio", href: "#" },
  { name: "Setting", href: "#" },
];

export default function Header() {
  const {  setOpenLogin, setOpenSignUp, setAppState,  isLogged, setIsLogged } = useContext(AppContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    isLogged ?
      setNavigation(navigation_array) :
      setNavigation([])
  }, [isLogged]);




  return (


    <header className="bg-background-light-alt dark:bg-gray-900 relative w-[100%] h-13 z-10">
      <nav
        className="mx-auto flex max-w-9xl items-center justify-between gap-x-4 p-2 px-4 sm:px-2 lg:px-3"
        aria-label="Global"
      >
        <div className="flex lg:flex">
          
        </div>
        {/* <div className="flex-1 lg:flex-1 h-8 w-auto drag" /> */}
        <div className="hidden lg:flex lg:gap-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              name={item.name}
              onClick={(e) => {
                setAppState(e.target.name)
              }}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex-1 lg:flex-1 h-8 w-auto drag" />
        <div className="flex flex items-center justify-end gap-x-6">
          {isLogged ? (
            <button
              onClick={() => {
                // Handle log out logic
                localStorage.clear()
                setIsLogged(false);
                setAppState('Home')
              }}
              className="hidden lg:block lg:text-sm lg:leading-6 lg:text-white-500 dark:text-white px-1"
            >
              Log out
            </button>
          ) : (
            <>
              <button
                className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-white-900 dark:text-white"
                onClick={() => {
                  setOpenLogin(true);
                }}
              >
                Log in
              </button>
              <button
                href="#"
                onClick={() => {
                  setOpenSignUp(true);
                }}
                className="rounded-md bg-[#4975BD] py-1 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex ">
          <button
            id="minimizeApp"
            className="px-3  bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded"
          >
            <span className="sr-only">Minimize</span>
            &#x2013;
          </button>
          <button
            id="maximizeApp"
            className="px-3 mx-1 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded"
          >
            <span className="sr-only">Maximize</span>
            &#x25A1;
          </button>
          <button
            id="closeApp"
            className="px-3  bg-gray-400 hover:bg-red-600 active:bg-red-300 rounded "
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[white] dark:bg-[#202020] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            
            {!isLogged ? (
              <p
                onClick={() => {
                  setOpenSignUp(true);
                }}
                href="#"
                className="ml-auto rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </p>) : (<div />)}
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    onClick={(e) => {
                      setAppState(e.target.name)
                    }}
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-200  hover:bg-gray-800"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              {!isLogged ? (
                <div className="py-6">
                  <p
                    
                    onClick={() => {
                      setOpenLogin(true);
                    }}
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-200 hover:bg-gray-800"
                  >
                    Log in
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    // Handle log out logic
                    localStorage.clear()
                    setIsLogged(false);
                    setAppState('Home')
                  }}
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-200 hover:bg-gray-800"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>



    </header>
  );
}
