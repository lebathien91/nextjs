import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GlobalContext } from "../../store/GlobalState";
import Loading from "../Loading";
import Modal from "./Modal";

const Notify = () => {
  const { state } = useContext(GlobalContext);
  const { notify } = state;

  return (
    <>
      {notify.loading && <Loading />}
      {notify.modal && <Modal />}
      <ToastContainer />
    </>
  );
};

export default Notify;
