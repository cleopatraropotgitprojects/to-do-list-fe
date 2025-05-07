import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle,
  User,
  EyeOff,
  Eye,
} from "lucide-react";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (loading) {
      timer = setTimeout(() => setShowWaitMessage(true), 5000);
    } else {
      setShowWaitMessage(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://to-do-list-be-x9ex.onrender.com/auth/register",
        {
          name,
          email,
          password,
        },
      );

      // ✅ Salvăm userId în localStorage
      localStorage.setItem("userId", response.data.userId);

      setSuccess("Account created. Check your email for the code.");
      setTimeout(() => {
        navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      console.error("Registration failed:", err);
      if (err.response?.status === 409) {
        setError("Email already registered");
      } else {
        setError("Something went wrong during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-pink-50 px-4 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10">
          {loading && showWaitMessage && (
            <div className="mb-4 text-center text-sm text-yellow-600 font-medium">
              Wait a few minutes until the server is running...
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Create account
          </h1>
          <p className="text-base text-gray-500 mb-6">
            Register to get started
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

          <div className="space-y-5">
            <div>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-3.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold text-base transition shadow-md"
            >
              {loading
                ? showWaitMessage
                  ? "Register"
                  : "Creating..."
                : "Register"}
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-yellow-500 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-yellow-200 rounded-full blur-2xl opacity-40 animate-pulse z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-200 rounded-full blur-2xl opacity-40 animate-pulse z-0" />
    </div>
  );
};
