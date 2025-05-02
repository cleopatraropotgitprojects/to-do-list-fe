import { useParams } from "react-router-dom";
import { DayHeader } from "../components/DayHeader";
import { TaskList } from "../components/TaskList";

export const DayPage = () => {
  const { dateId } = useParams<{ dateId: string }>();

  if (!dateId) return null;

  return (
    <div className="container mx-auto py-4 flex flex-col overflow-hidden">
      <DayHeader dateId={dateId} />
      <div className="mt-6 space-y-2">
        <TaskList dateId={dateId} />
      </div>
    </div>
  );
};
