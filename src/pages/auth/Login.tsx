import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, AlertTriangle, EyeOff, Eye } from "lucide-react";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://to-do-list-be-x9ex.onrender.com/auth/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name || "User");

      navigate(`/day/${new Date().toISOString().split("T")[0]}`);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 403) {
          navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
        } else if (status === 404 || status === 401) {
          setError("Invalid credentials");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        console.error(err);
        setError("Unexpected error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-pink-50 px-4 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Welcome <span className="inline-block">👋</span>
          </h1>
          <p className="text-base text-gray-500 mb-6">Log in to your account</p>

          {error && (
            <div className="flex items-start bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertTriangle className="mr-2 mt-[2px]" size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
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
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold text-base transition shadow-md"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="text-yellow-500 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>

      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-yellow-200 rounded-full blur-2xl opacity-40 animate-pulse z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-200 rounded-full blur-2xl opacity-40 animate-pulse z-0" />
    </div>
  );
};
