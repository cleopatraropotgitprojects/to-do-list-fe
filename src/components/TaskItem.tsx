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
  const [isToggling, setIsToggling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setIsSaving(true);

    try {
      await axios.put(
        `https://to-do-list-be-x9ex.onrender.com/tasks/${props.id}`,
        {
          text: value,
          isRoutine: false,
          done: checked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      props.onUpdate(props.id, value);
      setEditing(false);
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    setIsDeleting(true);

    try {
      await axios.delete(
        `https://to-do-list-be-x9ex.onrender.com/tasks/${props.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      props.onDelete(props.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    const token = localStorage.getItem("token");
    setIsToggling(true);

    try {
      const res = await axios.patch(
        `https://to-do-list-be-x9ex.onrender.com/tasks/${props.id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setChecked(res.data.done);
    } catch (error) {
      console.error("Failed to toggle task", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className={clsx(
        "group w-full flex items-center justify-between px-5 py-4 rounded-xl shadow-sm transition-all duration-200 bg-white mx-4 animate-fadeInUp",
        checked ? "border-l-4 border-green-500 opacity-80" : "hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-3 w-full">
        {isToggling ? (
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <input
            type="checkbox"
            disabled={!props.canCheck}
            checked={checked}
            onChange={handleToggle}
            className="w-5 h-5 accent-green-500 transition"
          />
        )}

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
              "text-base flex-1",
              checked ? "line-through text-gray-400" : "text-gray-900",
            )}
          >
            {value}
          </span>
        )}
      </div>

      {props.canEdit && (
        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
          {editing ? (
            isSaving ? (
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <button onClick={handleSave} type="button">
                <Check size={18} className="text-green-600" />
              </button>
            )
          ) : (
            <button onClick={() => setEditing(true)} type="button">
              <Pencil size={18} className="text-gray-500" />
            </button>
          )}

          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <button onClick={handleDelete} type="button">
              <Trash size={18} className="text-red-400 hover:text-red-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
