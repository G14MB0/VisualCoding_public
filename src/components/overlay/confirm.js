import { useContext } from "react";
import { AppContext } from "../../provider/appProvider";
import ButtonMain from "../UI/buttons/ButtonMain";

export default function Confirm({ children, onClick }) {
  const { setOverlay } = useContext(AppContext);
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="flex items-center justify-center w-full">
            <div className="mx-8 mt-4 w-0 flex pt-0.5  w-full">
              <p className="mt-1 text-sm text-gray-500">{children}</p>
            </div>
          </div>
          <hr class="mx-4 mt-4 h-0.5 border-t-0 bg-neutral-0 opacity-100 dark:opacity-50" />

          <div className="ml-4 flex justify-end m-4 mt-2 items-center">
            <div
              className="flex items-center m-2 w-[8%] text-gray-500 cursor-pointer"
              onClick={(e) => {
                setOverlay(false);
              }}
            >
              Close
            </div>
            <div className="w-20 ml-3">
              <ButtonMain children={"Confirm"} onClick={onClick} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
