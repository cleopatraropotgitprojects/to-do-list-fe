import { addDays, format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

export const DayHeader = (props: { dateId: string }) => {
  const currentDate = parseISO(props.dateId);
  const navigate = useNavigate();

  const formatted = format(currentDate, "EEEE, d MMMM yyyy"); // ex: Tuesday, 1 May 2025

  const goToPrevious = () => {
    const prevDate = format(addDays(currentDate, -1), "yyyy-MM-dd");
    navigate(`/day/${prevDate}`);
  };

  const goToNext = () => {
    const nextDate = format(addDays(currentDate, 1), "yyyy-MM-dd");
    navigate(`/day/${nextDate}`);
  };

  return (
    <div className="fixed bottom-2 left-0 w-full bg-white border-t border-gray-300 shadow-sm flex justify-between items-center px-4 py-3 z-10">
      <button
        onClick={goToPrevious}
        className="text-sm text-blue-500 hover:underline"
      >
        ← Previous
      </button>
      <h2 className="text-lg font-semibold">{formatted}</h2>
      <button
        onClick={goToNext}
        className="text-sm text-blue-500 hover:underline"
      >
        Next →
      </button>
    </div>
  );
};
