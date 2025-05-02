import { TaskItem } from "./TaskItem";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import { getDayType } from "../utils/dateUtils";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import axios from "axios";

interface Task {
  id: string;
  text: string;
}

const SortableTask = ({
  id,
  children,
  tasks,
}: {
  id: string;
  children: React.ReactNode;
  tasks: Task[];
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={(e) => {
        // Prevent drag handlers from capturing button clicks
        if (
          e.target instanceof HTMLElement &&
          (e.target.closest("button") || e.target.tagName === "BUTTON")
        ) {
          e.stopPropagation();
        }
      }}
      className="flex justify-between items-center gap-2 mb-2"
    >
      <span
        {...listeners}
        className="cursor-grab font-bold text-sm text-gray-400"
      >
        {tasks.findIndex((t) => t.id === id) + 1}
      </span>
      {children}
    </div>
  );
};

export const TaskList = ({ dateId }: { dateId: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const dayType = getDayType(dateId);
  const isDraggable = dayType !== "past";
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `https://to-do-list-be-x9ex.onrender.com/tasks?date=${dateId}`,
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [dateId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    const updated = [...tasks];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    setTasks(updated);
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;

    const res = await axios.post(
      "https://to-do-list-be-x9ex.onrender.com/tasks",
      {
        text: newTaskText,
        isRoutine: false,
        done: false,
        date: dateId,
      },
    );

    setTasks((prev) => [
      ...prev,
      ...(Array.isArray(res.data) ? res.data : [res.data]),
    ]);
    setNewTaskText("");
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="p-2 text-slate-600 rounded-full hover:bg-slate-100"
        >
          <Plus size={20} />
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Task</h2>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Task description"
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl w-[30%] hover:bg-red-100"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl w-[70%] hover:bg-slate-200"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-4">Add a Task</div>
        ) : (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <SortableTask key={task.id} id={task.id} tasks={tasks}>
                <TaskItem
                  id={task.id}
                  text={task.text}
                  canEdit={isDraggable}
                  canCheck={dayType === "today"}
                  onDelete={(id) =>
                    setTasks((prev) => prev.filter((t) => t.id !== id))
                  }
                  onUpdate={(id, newText) =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === id ? { ...t, text: newText } : t,
                      ),
                    )
                  }
                />
              </SortableTask>
            ))}
          </SortableContext>
        )}
      </DndContext>
    </div>
  );
};
