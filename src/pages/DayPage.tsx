import { useParams } from "react-router-dom";

export const DayPage = () => {
  const { dateId } = useParams<{ dateId: string }>();

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Day: {dateId}</h1>
    </div>
  );
};
