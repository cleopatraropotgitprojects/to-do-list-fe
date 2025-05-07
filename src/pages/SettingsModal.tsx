import { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff, Lock } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setMessage("");
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!password || !newPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        "https://to-do-list-be-x9ex.onrender.com/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: password,
            newPassword: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Backend response:", data);
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Password changed successfully!");
      setPassword("");
      setNewPassword("");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("CHANGE PASSWORD ERROR:", err);
      setMessage(err.message || "Unexpected error");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Settings ⚙️</h2>
        <p className="text-sm text-gray-500 mb-6">Update your account below</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />

              <input
                id="password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />

              <input
                id="password"
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2.5 rounded-xl font-semibold transition shadow-md"
          >
            Save Changes
          </button>

          {message && (
            <p
              className={clsx(
                "text-center text-sm mt-3",
                message.includes("success") ? "text-green-600" : "text-red-500",
              )}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
