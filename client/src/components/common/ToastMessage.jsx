import { forwardRef, useImperativeHandle } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const ToastMessage = forwardRef((props, ref) => {
  const notify = () => toast(props.message.topic);

  useImperativeHandle(ref, () => {
    return {
      notifyFunction: notify,
    };
  });

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={props.time}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
      {props.children}
    </>
  );
});

ToastMessage.displayName = "ToastMessage";
