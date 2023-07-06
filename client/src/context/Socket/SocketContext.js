import { createContext, useContext } from "react";

export const SocketContext = createContext({
  socket: "",
  socketId: "",
});

export const useSocketContext = () => useContext(SocketContext);
