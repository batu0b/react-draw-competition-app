import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { DrawPage } from "../pages/DrawPage";
export const RouterPage = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/draw-room/:roomId" element={<DrawPage />} />
      </Routes>
    </>
  );
};
