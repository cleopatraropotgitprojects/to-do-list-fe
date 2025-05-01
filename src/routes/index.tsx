import { Navigate, Route, Routes } from "react-router-dom";
import { DayPage } from "../pages/DayPage";
import { format } from "date-fns";

export const RoutesIndex = () => {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/day/${today}`} />} />
      <Route path="/" element={<DayPage />} />
    </Routes>
  );
};
