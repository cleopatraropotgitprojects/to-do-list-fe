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
      <div className="text-left mb-4 px-2">
        <p className="text-sm md:text-base text-gray-500 font-medium">
          Hi, Cleopatra,
        </p>
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          What’s up for today?
        </h1>
      </div>

      {/* Luna */}
      <h2 className="text-center text-lg md:text-xl font-semibold text-gray-900 mb-3">
        {format(selectedDate, "MMMM")}
      </h2>

      {/* Header cu zilele săptămânii + zilele lunii */}
      <div className="grid grid-cols-9 items-center gap-1 text-center text-xs mb-5 md:text-sm">
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
          const isTodaySelected = isTodayDate && isSelected;

          return (
            <button
              key={id}
              onClick={() => navigate(`/day/${format(date, "yyyy-MM-dd")}`)}
              className={`w-8 h-8 rounded-full text-sm md:text-base font-medium flex items-center justify-center mx-auto
                ${
                  isTodaySelected
                    ? "bg-pink-100 text-purple-600"
                    : isTodayDate
                      ? "border border-purple-300 text-purple-500"
                      : isSelected
                        ? "bg-gray-200 text-gray-800"
                        : "text-gray-800 hover:bg-gray-100"
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
      <hr />
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
