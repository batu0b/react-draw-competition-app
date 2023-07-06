import { useState } from "react";
import { RoomContext } from "./RoomContext";

export const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const handleRoomId = (e, isAuto = false) => {
    if (!isAuto) {
      setRoomId(e.target.value);
    } else {
      setRoomId(e);
    }
  };

  const handleUserName = (e, isAuto = false) => {
    if (isAuto) {
      setUserName(e);
    } else {
      setUserName(e.target.value);
    }
  };

  return (
    <RoomContext.Provider
      value={{
        roomId: roomId,
        setRoomId: handleRoomId,
        setUserName: handleUserName,
        userName: userName,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
