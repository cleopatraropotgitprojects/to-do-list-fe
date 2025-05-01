import { isBefore, isSameDay, parseISO } from "date-fns";

export const getDayType = (dateId: string): "past" | "today" | "future" => {
  const inputDate = parseISO(dateId);
  const today = new Date();

  if (isSameDay(inputDate, today)) return "today";
  if (isBefore(inputDate, today)) return "past";
  return "future";
};
