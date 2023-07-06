import { Canvas } from "../components/Draw/Canvas";
import { CountDown } from "../components/Draw/CountDown";
import { useEffect, useRef, useState } from "react";
import { useRoomContext } from "../context/Room/RoomContext";
import { useSocketContext } from "../context/Socket/SocketContext";
import { canvasToUri, clearCanvas } from "../helpers";
import { useNavigate } from "react-router-dom";
import { RateDraw } from "../components/Draw/RateDraw";
import { ToastMessage } from "../components/common/ToastMessage";

export const DrawPage = () => {
  const [room, setRoom] = useState(null);
  const [draws, setDraws] = useState(null);
  const [allReady, setAllReady] = useState(false);
  const [isTopicSubmited, setIsTopicSubmited] = useState(false);
  const [topic, setTopic] = useState("");
  const [me, setMe] = useState(null);
  const sec = 1000;
  const timer = 10;
  const [time, setTime] = useState(timer);
  const countDownRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const toastRef = useRef(null);
  const { roomId, setRoomId } = useRoomContext();
  const { socket, socketId } = useSocketContext();
  const navigate = useNavigate();
  const isRequestSentRef = useRef(false);

  const removeDraws = () => {
    setDraws(null);
  };

  const handleWindowClose = () => {
    if (!isRequestSentRef.current) {
      socket.emit("disconnect-room", roomId);
      isRequestSentRef.current = true;
    }
  };

  const handleNotify = () => {
    toastRef?.current.notifyFunction();
  };

  useEffect(() => {
    if (!roomId) {
      navigate("/");
    } else {
      socket.emit("get-room", { room: roomId });
      socket.on("get-room", (data) => {
        setRoom({ ...data });
        setAllReady(
          [...Object.values(data.users)].every((x) => {
            return x.ready;
          })
        );
        setMe({ ...data.users[socketId] });
      });
      socket.on("get-draw", (data) => {
        setDraws([...data]);
      });
      socket.on("get-random-topic", (data) => {
        setTopic(data);
      });

      window.addEventListener("unload", handleWindowClose);
    }

    return () => {
      if (roomId) {
        socket.off("get-room");
        socket.off("get-draw");
        socket.off("get-random-topic");
        socket.emit("disconnect-room", roomId);
        window.removeEventListener("unload", handleWindowClose);
        setRoomId("", true);
      }
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (!!allReady) {
      handleNotify();
      timerRef.current = setTimeout(() => {
        setAllReady(false);
        const canvasUri = canvasToUri(canvasRef);
        socket.emit("send-draws", { room: roomId, draw: canvasUri });
        clearCanvas(canvasRef);
        socket.emit("get-ready", { room: roomId, ready: false });
        setTime(timer);
        setIsTopicSubmited(false);
      }, sec * timer);
      countDownRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, sec);
    }

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countDownRef.current);
    };
  }, [allReady, topic]);

  return (
    <div className="general-div p-4 flex items-center justify-evenly  flex-col">
      <ToastMessage message={topic} time={sec * timer} ref={toastRef}>
        {!!draws && <RateDraw removeImages={removeDraws} images={draws} />}

        <div className="flex justify-evenly flex-wrap w-full items-center">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="basis-1/3 h-full flex items-center ">
              <CountDown
                istopicSubmited={isTopicSubmited}
                allReady={allReady}
                me={me}
                time={time}
              />
            </div>
            <span className="basis-1/5  ">
              <div className="min-h-[300px] custom-scrollbar h-fit rounded-sm  text-white  bg-bgray border-bwhite border-2 w-[300px] overflow-y-scroll">
                {room &&
                  Object.entries(room?.users)?.map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 flex gap-4 bg-bdark border-b-2 border-bblue"
                    >
                      <span className="font-kablammo">{value.userName}</span>
                      <span className="font-lobster">
                        {value.ready ? (
                          <span className="text-green-500">Ready</span>
                        ) : (
                          <span className="text-red-600">Not Ready</span>
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </span>
          </div>
          <div>
            <Canvas
              isTopicSubmited={isTopicSubmited}
              setIsTopicSubmited={setIsTopicSubmited}
              ref={canvasRef}
            />
          </div>
        </div>
        <button onClick={handleNotify}>asdads</button>
      </ToastMessage>
    </div>
  );
};
