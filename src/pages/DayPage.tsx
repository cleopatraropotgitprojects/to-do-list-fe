import { useParams } from "react-router-dom";
import { DayHeader } from "../components/DayHeader";
import { TaskItem } from "../components/TaskItem";
import { getDayType } from "../utils/dateUtils";
import { TaskList } from "../components/TaskList";

export const DayPage = () => {
  const { dateId } = useParams<{ dateId: string }>();

  if (!dateId) return null;

  const dayType = getDayType(dateId);

  const canEdit = dayType !== "past";
  const canCheck = dayType === "today";

  return (
    <div className="flex flex-col min-h-screen">
      <DayHeader dateId={dateId} />
      {/*<h1 className="font-bold text-xl text-center">Day: {dateId}</h1>*/}
      <div className="mt-6 space-y-2">
        <TaskList
          dateId={dateId}
          initialTasks={[
            { id: "1", text: "Fă curat în inbox" },
            { id: "2", text: "Scrie pe LinkedIn" },
            { id: "3", text: "Meditație de dimineață" },
          ]}
        />
      </div>
    </div>
  );
};
