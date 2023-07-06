import { useRoomContext } from "../../context/Room/RoomContext";
import { useSocketContext } from "../../context/Socket/SocketContext";

export const CountDown = ({ allReady, me, time, istopicSubmited }) => {
  const { socket } = useSocketContext();
  const { roomId } = useRoomContext();

  const handleGetReady = () => {
    socket.emit("get-ready", { room: roomId, ready: true });
  };

  return (
    <div className="w-28 h-28 flex items-center justify-center text-center font-lobster mode-btn p-0 flex items-center text-base cursor-pointer">
      {allReady ? (
        time
      ) : me?.ready ? (
        "Waiting Other Players.."
      ) : (
        <button
          disabled={!istopicSubmited}
          onClick={handleGetReady}
          className=" w-full h-full  bg-transparent rounded-full "
        >
          Start
        </button>
      )}
    </div>
  );
};
