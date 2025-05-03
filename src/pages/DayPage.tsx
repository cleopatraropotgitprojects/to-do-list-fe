import { useParams } from "react-router-dom";
import { DayHeader } from "../components/DayHeader";
import { TaskList } from "../components/TaskList";

export const DayPage = () => {
  const { dateId } = useParams<{ dateId: string }>();

  if (!dateId) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff7ed] via-[#fffef9] to-[#fef2f2]">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20 animate-pulse z-0" />
      <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse z-0" />

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-pink-200 opacity-30 animate-bounce z-0"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <main className="relative z-10 px-4 md:px-8 max-w-3xl mx-auto py-6 flex flex-col">
        <DayHeader dateId={dateId} />
        <div className="mt-6 space-y-2">
          <TaskList dateId={dateId} />
        </div>
      </main>
    </div>
  );
};
