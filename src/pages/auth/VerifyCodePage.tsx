import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const VerifyCodePage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Missing email");
      return;
    }

    const finalCode = code.join("");
    if (finalCode.length !== 6) {
      setError("Enter full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://to-do-list-be-x9ex.onrender.com/auth/verify", {
        email,
        code: finalCode,
      });

      setSuccess("Account verified!");
      setTimeout(() => navigate("/auth/login"), 2000); // navighează după 2 sec
    } catch (err) {
      console.error("Verification failed:", err);
      setError("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-yellow-50 to-pink-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Verify your account
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code we emailed you
        </p>

        {error && (
          <div className="flex items-start bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
            <AlertTriangle className="mr-2 mt-[2px]" size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
            <CheckCircle className="mr-2 mt-[2px]" size={18} />
            <span>{success}</span>
          </div>
        )}

        <div className="flex justify-center gap-3 mb-6">
          {code.map((digit, idx) => (
            <input
              key={idx}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              // @ts-ignore
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-14 text-center border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || code.includes("")}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold text-base transition shadow-md"
        >
          {loading ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
