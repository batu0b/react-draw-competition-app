import { useEffect, useState } from "react";
import { BiSolidStarHalf, BiSolidStar, BiStar } from "react-icons/bi";
import { useSocketContext } from "../../context/Socket/SocketContext";
import { useRoomContext } from "../../context/Room/RoomContext";

export const RateDraw = ({ images, removeImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [winner, setWinner] = useState(null);

  const [showSubmit, setShowSubmit] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const { socket } = useSocketContext();
  const { roomId } = useRoomContext();
  const handleVote = (rate) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [images[currentIndex]?.whoIs]: rate,
    }));

    if (currentIndex === images.length - 1) {
      setShowSubmit(true);
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handleSubmit = () => {
    socket.emit("rate-draws", { room: roomId, draw: votes });
    setIsSubmited(true);
  };
  useEffect(() => {
    let timer;

    socket.on("close-page", (data) => {
      timer = setTimeout(() => {
        if (data) {
          removeImages();
        }
      }, 5000);
    });
    socket.on("get-winner", (data) => {
      setWinner(data);
    });

    return () => {
      clearTimeout(timer);
      socket.off("close-page");
      socket.off("get-winner");
    };
  }, [socket]);

  return (
    <div className="absolute text-bdark flex items-center h-[508px] justify-around z-50 rounded-lg shadow-lg shadow-bdark border-4 border-bblue bg-bwhite min-w-[800px]  min-h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
      {!winner ? (
        <>
          <div className="flex flex-col justify-around text-bwhite h-full">
            <button
              onClick={() => handleVote(3)}
              className="bg-bblue active:scale-125 rounded-md shadow-md transition-all duration-200 shadow-bdark   p-6 "
            >
              <BiSolidStar />
            </button>
            <button
              onClick={() => handleVote(2)}
              className="bg-bblue rounded-md  active:scale-125 shadow-md transition-all duration-200 shadow-bdark  p-6 "
            >
              <BiSolidStarHalf />
            </button>
            <button
              onClick={() => handleVote(1)}
              className="bg-bblue rounded-md  active:scale-125 shadow-md transition-all duration-200 shadow-bdark  p-6 "
            >
              <BiStar />
            </button>
          </div>
          <img
            className="bg-white "
            key={images[currentIndex].whoIs}
            src={images[currentIndex].src}
          />
          <div className="flex h-full items-center">
            {showSubmit ? (
              <button
                disabled={isSubmited}
                onClick={handleSubmit}
                className="bg-bblue  shadow-md rounded-md  active:scale-125 transition-all duration-200 shadow-bdark h-3/4 p-6 text-bwhite"
              >
                Submit
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <div>
          <h1>WINNER: {winner}</h1>
        </div>
      )}
    </div>
  );
};
