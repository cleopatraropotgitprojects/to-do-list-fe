import { useParams } from "react-router-dom";
import { DayHeader } from "../components/DayHeader";
import { TaskItem } from "../components/TaskItem";
import { getDayType } from "../utils/dateUtils";

export const DayPage = () => {
  const { dateId } = useParams<{ dateId: string }>();

  if (!dateId) return null;

  const dayType = getDayType(dateId);

  const canEdit = dayType !== "past";
  const canCheck = dayType === "today";

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="font-bold text-xl text-center">Day: {dateId}</h1>
      <div className="mt-6 space-y-2">
        <TaskItem text="Task din test" canEdit={canEdit} canCheck={canCheck} />
        <TaskItem
          text="Alt task static"
          canEdit={canEdit}
          canCheck={canCheck}
        />
      </div>
      <DayHeader dateId={dateId} />
    </div>
  );
};
