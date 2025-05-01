import { useParams } from "react-router-dom";
import { DayHeader } from "../components/DayHeader";

export const DayPage = () => {
  const { dateId } = useParams<{ dateId: string }>();

  if (!dateId) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="font-bold text-xl">Day: {dateId}</h1>
      <DayHeader dateId={dateId} />
    </div>
  );
};
