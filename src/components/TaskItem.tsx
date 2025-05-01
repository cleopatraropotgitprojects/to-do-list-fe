import { useState } from "react";
import clsx from "clsx";

export const TaskItem = (props: {
  text: string;
  canEdit: boolean;
  canCheck: boolean;
}) => {
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState(props.text);

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-4 py-3 border rounded-lg shadow-sm",
        "transition-all duration-200",
        checked ? "bg-green-50 border-green-300" : "bg-white border-gray-300",
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <input
          type="checkbox"
          disabled={!props.canCheck}
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="w-4 h-4 accent-green-500"
        />
        {props.canEdit ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm"
          />
        ) : (
          <span
            className={clsx(
              "text-sm",
              checked ? "line-through opacity-50" : "text-gray-800",
            )}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
};
