import { useState } from "react";
import clsx from "clsx";
import { Pencil, Check, Trash } from "lucide-react";
import axios from "axios";

export const TaskItem = (props: {
  id: string;
  text: string;
  canEdit: boolean;
  canCheck: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
}) => {
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState(props.text);
  const [editing, setEditing] = useState(false);
  console.log("TaskItem", props.id, "canEdit:", props.canEdit);

  const handleSave = async () => {
    await axios.put(
      `https://to-do-list-be-x9ex.onrender.com/tasks/${props.id}`,
      {
        text: value,
        isRoutine: false,
        done: checked,
      },
    );
    props.onUpdate(props.id, value);

    setEditing(false);
  };

  const handleDelete = async () => {
    await axios.delete(
      `https://to-do-list-be-x9ex.onrender.com/tasks/${props.id}`,
    );
    props.onDelete(props.id);
  };

  return (
    <div
      className={clsx(
        "w-full group flex items-center justify-between px-4 py-3 border rounded-lg shadow-sm transition-all duration-200",
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
        {editing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm"
          />
        ) : (
          <span
            className={clsx(
              "text-sm flex-1",
              checked ? "line-through opacity-50" : "text-gray-800",
            )}
          >
            {value}
          </span>
        )}
      </div>

      {props.canEdit && (
        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
          {editing ? (
            <button onClick={handleSave} type="button">
              <Check size={18} className="text-green-600" />
            </button>
          ) : (
            <button onClick={() => setEditing(true)} type="button">
              <Pencil size={18} className="text-gray-500" />
            </button>
          )}
          <button onClick={handleDelete} type="button">
            <Trash size={18} className="text-red-400 hover:text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
};
