import { useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { io } from "socket.io-client";
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketID, setSocketID] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    socket.connect();
    socket.on("connect", () => {
      setSocketID(socket.id);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket, socketId: socketID }}>
      {children}
    </SocketContext.Provider>
  );
};
