import { Navigate, Route, Routes } from "react-router-dom";
import { DayPage } from "../pages/DayPage";
import { format } from "date-fns";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Landing } from "../pages/auth/Landing";
import { VerifyCodePage } from "../pages/auth/VerifyCodePage";

export const RoutesIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify" element={<VerifyCodePage />} />
      <Route path="/day/:dateId" element={<DayPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
