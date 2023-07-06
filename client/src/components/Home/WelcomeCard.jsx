export const WelcomeCard = ({
  createRoom,
  joinRoom,
  setUserName,
  setRoomId,
}) => {
  return (
    <div className="bg-bdark relative  text-bwhite shadow-lg flex flex-col gap-11 shadow-bgray min-h-[300px] h-fit  rounded-md w-3/6 max-lg:w-3/4 max-md:w-11/12   border-4 border-bwhite p-4 ">
      <div>
        <h1 className="text-bblue font-lobster text-5xl">Art.io</h1>
      </div>
      <div className="flex justify-between font-outline max-lg:flex-col max-lg:divide-y-2 max-lg:divide-x-0  divide-x-2">
        <div className="flex basis-1/2  p-4  flex-col items-center gap-4">
          <div className="labelContainer">
            <label>Room Id:</label>
            <input onChange={(e) => setRoomId(e)} type="text" className="p-1" />
          </div>
          <div className="labelContainer">
            <label>User Name:</label>
            <input
              onChange={(e) => setUserName(e)}
              type="text"
              className="p-1"
            />
          </div>
          <button
            onClick={joinRoom}
            className="bg-bgray border-2 border-bblue hover:scale-105 text-bwhite shadow-inner shadow-bdark  duration-300  p-3 rounded-md "
          >
            Join Room
          </button>
        </div>
        <div className="basis-1/2 p-4 flex gap-4 items-center justify-between flex-col">
          <p className="font-lobster text-xl   ">
            Or you can create a new room by inviting your friends to the room
            you have set up.
          </p>
          <div className="labelContainer">
            <label>User Name:</label>
            <input
              onChange={(e) => setUserName(e)}
              type="text"
              className="p-1"
            />
          </div>
          <button
            onClick={() => createRoom()}
            className="bg-bgray border-2 border-bblue hover:scale-105 text-bwhite shadow-inner shadow-bdark  duration-300  p-3 rounded-md "
          >
            Host Room
          </button>
        </div>
      </div>
    </div>
  );
};
