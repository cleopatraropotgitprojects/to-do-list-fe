import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token && userId) {
      // Salvează tokenul și userId în localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Obține data curentă pentru a o folosi în URL
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const dateId = `${yyyy}-${mm}-${dd}`;

      // Redirecționează către pagina zilei curente
      navigate(`/day/${dateId}`);
    } else {
      // Dacă nu sunt token și userId, redirecționează utilizatorul către pagina de login
      navigate("/auth/login");
    }
  }, [navigate]);

  return <p>Authenticating...</p>;
};
