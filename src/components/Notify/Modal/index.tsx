import { useContext } from "react";
import { MdClose } from "react-icons/md";

import { GlobalContext } from "@/store/GlobalState";

const Modal = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const { modal } = state.notify;
  const { title, message, handleSure } = modal;

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full overflow-x-hidden overflow-y-auto outline-none">
      <div className="fixed top-0 left-0 bg-gray-800 opacity-30 w-full h-full"></div>
      <div className="relative z-50 m-2 mx-auto md:my-8 max-w-[500px] w-auto pointer-events-none ">
        <div className="relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding border border-gray-400 rounded-md outline-none">
          <div className="flex flex-shrink-0 items-center justify-between p-3 border-b border-[#dee2e6] rounded-tl-[calc(0.3rem - 1px)] rounded-tr-[calc(0.3rem-1px)]">
            <h5 className="text-xl md:text-2xl font-semibold">{title}</h5>
            <span
              className="cursor-pointer"
              onClick={() => dispatch({ type: "NOTIFY", payload: {} })}
            >
              <MdClose size={25} />
            </span>
          </div>
          <div className="relative flex-auto px-4 py-6">
            <p className="text-xl">{message}</p>
          </div>
          <div className="flex flex-wrap flex-shrink-0 items-center justify-end p-3 border-t border-t-[#dee2e6] rounded-br-[calc(0.3rem-1px)] border-bl-[calc(0.3rem-1px)]">
            <button
              className="m-1 font-medium text-center px-4 py-2 border rounded-md text-white bg-red-600 hover:bg-gray-500"
              onClick={handleSure}
            >
              Yes
            </button>
            <button
              className="m-1 font-medium text-center px-4 py-2 border rounded-md text-white bg-green-800 hover:bg-gray-500"
              onClick={() => dispatch({ type: "NOTIFY", payload: {} })}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
