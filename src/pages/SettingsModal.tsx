import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    setMessage("Settings saved successfully!");
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
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2.5 rounded-xl font-semibold transition shadow-md"
          >
            Save Changes
          </button>

          {message && (
            <p className="text-green-600 text-center text-sm mt-3">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
