import { useState } from "react";
import {
  format,
  parseISO,
  isToday,
  addDays,
  subDays,
  differenceInCalendarDays,
} from "date-fns";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import profilePic from "../types/kek.png";

export const DayHeader = ({ dateId }: { dateId: string }) => {
  const initialDate = parseISO(dateId);
  const [startDate, setStartDate] = useState(subDays(initialDate, 3));
  const selectedDate = parseISO(dateId);
  const navigate = useNavigate();
  const currentDate = parseISO(dateId);
  const today = new Date();
  const dayDiff = differenceInCalendarDays(currentDate, today);

  const label =
    dayDiff === 0
      ? "Today"
      : dayDiff === 1
        ? "Tomorrow"
        : dayDiff === -1
          ? "Yesterday"
          : null;

  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const goToPrevious = () => {
    setStartDate((prev) => subDays(prev, 3));
  };

  const goToNext = () => {
    setStartDate((prev) => addDays(prev, 3));
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <p className="text-sm text-gray-400 font-medium">Hello, User 👋</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Let’s plan your day!
          </h1>
        </div>
        <img
          src={profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-md"
        />
      </div>

      <div className="bg-white/50 backdrop-blur-md py-2 rounded-xl shadow-sm">
        <h2 className="text-center text-lg md:text-xl font-semibold text-gray-900 mb-3">
          {format(selectedDate, "MMMM")}
        </h2>
        <div className="grid grid-cols-9 items-center gap-[2px] text-center text-xs mb-5 md:text-sm">
          <div></div>
          {days.map((date) => (
            <div key={format(date, "yyyy-MM-dd")} className="text-gray-500">
              {format(date, "EEE")}
            </div>
          ))}
          <div></div>

          <button
            onClick={goToPrevious}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ←
          </button>

          {days.map((date) => {
            const id = format(date, "yyyy-MM-dd");
            const isSelected = format(selectedDate, "yyyy-MM-dd") === id;
            const isTodayDate = isToday(date);

            return (
              <button
                key={id}
                onClick={() => navigate(`/day/${id}`)}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-medium flex items-center justify-center mx-auto
          ${
            isSelected
              ? "bg-yellow-400 text-white shadow"
              : isTodayDate
                ? "border border-yellow-400 text-yellow-500"
                : "text-gray-500 hover:bg-gray-100"
          }`}
              >
                {format(date, "d")}
              </button>
            );
          })}

          <button
            onClick={goToNext}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-6 px-2">
        <p className="text-[11px] uppercase text-gray-400 tracking-wide">
          {label ?? format(currentDate, "EEEE")}
        </p>
        <p className="text-base md:text-lg font-medium text-gray-800">
          {format(currentDate, "EEEE d MMMM")}
        </p>
      </div>
    </div>
  );
};
