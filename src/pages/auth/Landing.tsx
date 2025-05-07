import { Link } from "react-router-dom";
// @ts-ignore
import image from "../../images/landing-image.png";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-pink-50 px-4 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
          Check <span className="text-yellow-400">!</span>
        </h1>
        <p className="mt-3 font-light text-base md:text-lg text-gray-600 tracking-wide mb-8 text-center">
          Make your to-do list easily
        </p>

        <img
          src={image}
          alt="Welcome illustration"
          className="w-72 md:w-80 mb-10 drop-shadow-md select-none pointer-events-none"
        />

        <div className="space-y-4 w-full max-w-xs">
          <Link
            to="/auth/register"
            className="block text-center w-full bg-yellow-400 text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-yellow-500 transition"
          >
            Register
          </Link>
          <Link
            to="/auth/login"
            className="block text-center w-full border border-yellow-400 text-yellow-500 py-3 rounded-lg text-lg font-bold hover:bg-yellow-50 transition"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-yellow-200 rounded-full blur-2xl opacity-40 animate-pulse z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-200 rounded-full blur-2xl opacity-40 animate-pulse z-0" />
    </div>
  );
};
