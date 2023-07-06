import { forwardRef, useEffect, useState } from "react";
import {
  BsFillEraserFill,
  BsFillPencilFill,
  BsFillTrashFill,
} from "react-icons/bs";
import { useSocketContext } from "../../context/Socket/SocketContext";
import { useRoomContext } from "../../context/Room/RoomContext";
export const Canvas = forwardRef((props, ref) => {
  const canvasRef = ref;
  const [topic, setTopic] = useState("");
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [canvasCTX, setCanvasCTX] = useState(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [mode, setMode] = useState("PEN");
  const { socket } = useSocketContext();
  const { roomId } = useRoomContext();
  //canvas

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;
    setCanvasCTX(ctx);
  }, [canvasRef]);

  const SetPos = (e) => {
    // The e variable is the event
    setMouseData({
      x: e.offsetX, // Mouse X position
      y: e.offsetY, // Mouse Y position
    });
  };

  const Draw = (e) => {
    if (e.buttons !== 1) return; // The left mouse button should be pressed
    const ctx = canvasCTX; // Our saved context
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath(); // Start the line
    ctx.moveTo(mouseData.x, mouseData.y); // Move the line to the saved mouse location
    setMouseData({
      x: e.offsetX, // Update the mouse location
      y: e.offsetY, // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
    });
    ctx.lineTo(e.offsetX, e.offsetY); // Again draw a line to the mouse postion
    ctx.strokeStyle = color; // Set the color as the saved state
    ctx.lineWidth = size; // Set the size to the saved state
    // Set the line cap to round
    ctx.lineCap = "round";
    ctx.stroke(); // Draw it!
  };

  const Delete = (e) => {
    if (e.buttons !== 1) return;
    const ctx = canvasCTX;

    setMouseData({
      x: e.offsetX, // Update the mouse location
      y: e.offsetY, // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
    });
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(mouseData.x, mouseData.y);
    setMouseData({
      x: e.offsetX, // Update the mouse location
      y: e.offsetY, // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
    });
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke(); // Draw it!
  };

  const DrawMode = (e) => {
    switch (mode) {
      case "PEN":
        return Draw(e);
      case "ERASER":
        return Delete(e);

      default:
        break;
    }
  };

  const ClearRect = () => {
    const ctx = canvasCTX;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  //submit button
  const handleSubmit = () => {
    props.setIsTopicSubmited(true);
    socket.emit("send-topic", { topic: topic, room: roomId });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 ">
        <div>
          <canvas
            onMouseEnter={(e) => SetPos(e.nativeEvent)}
            onMouseMove={(e) => {
              SetPos(e.nativeEvent);
              DrawMode(e.nativeEvent);
            }}
            onMouseDown={(e) => {
              DrawMode(e.nativeEvent);
            }}
            className="bg-bwhite rounded-md border-4 border-bblue"
            ref={canvasRef}
          ></canvas>
        </div>
        <div className="flex flex-col justify-between  items-center h-[500px] p-4">
          <div className="flex flex-col gap-4">
            <button
              data-active={`${mode === "PEN" ? "true" : "flase"}`}
              className="mode-btn"
              onClick={() => setMode("PEN")}
            >
              <BsFillPencilFill />
            </button>
            <button
              data-active={`${mode === "ERASER" ? "true" : "flase"}`}
              className="mode-btn"
              onClick={() => setMode("ERASER")}
            >
              <BsFillEraserFill />
            </button>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div className="h-20 w-20 border-bblue border-4 cursor-pointer  relative  rounded-full overflow-hidden">
              <input
                className="h-24 w-28 absolute top-1/2 left-1/2 -translate-x-1/2 cursor-pointer -translate-y-1/2"
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                }}
              />
            </div>
            <div className="h-fit">
              <input
                type="range"
                value={size}
                max={40}
                min={0}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <button
              onClick={ClearRect}
              className="mode-btn bg-red-600 text-white hover:bg-red-500"
            >
              <BsFillTrashFill />
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-[500px]">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="eg an elephant reading a book"
          className="w-[500px] pr-28 p-2"
          type="text"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={props.isTopicSubmited}
          className="absolute shadow-inner p-2 text-sm text-bwhite font-lobster shadow-bdark bg-bblue w-24 right-0 h-full"
        >
          Submit Topic
        </button>
      </div>
    </div>
  );
});

Canvas.displayName = "Canvas";
