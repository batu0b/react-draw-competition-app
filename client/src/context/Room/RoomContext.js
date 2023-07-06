import { createContext, useContext } from "react";

export const RoomContext = createContext({
  roomId: "",
  setRoomId: () => {},
  userName: "",
  setUserName: () => {},
});

export const useRoomContext = () => useContext(RoomContext);
