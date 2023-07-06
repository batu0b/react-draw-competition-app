import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/Socket/SocketProvider.jsx";
import { RoomProvider } from "./context/Room/RoomProvider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <RoomProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RoomProvider>
  </SocketProvider>
);
