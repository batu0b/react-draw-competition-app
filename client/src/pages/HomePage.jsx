import { WelcomeCard } from "../components/Home/WelcomeCard";
import Artist from "../assets/monster.svg";
import { v4 as uuidv4 } from "uuid";
import { useSocketContext } from "../context/Socket/SocketContext";
import { useRoomContext } from "../context/Room/RoomContext";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { socket } = useSocketContext();
  const { userName, roomId, setRoomId, setUserName } = useRoomContext();
  const navigate = useNavigate();

  const handleCreataRoom = async () => {
    if (userName.trim().length <= 0) return;
    const room = uuidv4();
    socket.emit("create-room", {
      room: room,
      userName: userName,
    });
    setRoomId(room, true);
    await socket.on("create-room", (data) => {
      if (data) {
        navigate(`/draw-room/${room}`);
      }
    });
  };
  const handleJoinRoom = async () => {
    if (userName.trim().length <= 0 && roomId.trim().length <= 0) return;
    socket.emit("join-room", {
      room: roomId,
      userName: userName,
    });

    await socket.on("join-room", (data) => {
      if (data) {
        navigate(`/draw-room/${roomId}`);
      }
    });
  };

  return (
    <div className="general-div    flex items-center justify-center">
      <WelcomeCard
        setRoomId={setRoomId}
        setUserName={setUserName}
        createRoom={handleCreataRoom}
        joinRoom={handleJoinRoom}
      />
      <img
        src={Artist}
        className="absolute bottom-0 max-h-full w-full z-0"
        alt=""
      />
    </div>
  );
};
