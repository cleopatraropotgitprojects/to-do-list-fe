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
import { LoaderCircle, Plus } from "lucide-react";
import axios from "axios";
import { isToday, parseISO } from "date-fns";

interface Task {
  id: string;
  text: string;
  done: boolean;
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
  const [isLoading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const date = parseISO(dateId);
  const today = new Date();

  const dayType = getDayType(dateId);
  const isDraggable = dayType !== "past";
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // 🔐 Nu apela dacă nu există token

      setLoading(true);
      try {
        const res = await axios.get(
          `https://to-do-list-be-x9ex.onrender.com/tasks?date=${dateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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

    setIsAdding(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://to-do-list-be-x9ex.onrender.com/tasks",
        {
          text: newTaskText,
          isRoutine: false,
          done: false,
          date: dateId,
          userId: localStorage.getItem("userId"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTasks((prev) => [
        ...prev,
        ...(Array.isArray(res.data) ? res.data : [res.data]),
      ]);

      setNewTaskText("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isPastDate = date < today && !isToday(date);

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className={`${isPastDate ? "bg-yellow-300 text-white cursor-not-allowed opacity-60 fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all z-50" : "fixed bottom-6 right-6 bg-yellow-400 text-white p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all z-50"}`}
          disabled={isPastDate}
        >
          <Plus size={24} />
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Add New Task
              </h2>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What's your task?"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-500 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={isAdding}
                  className="px-5 py-2 bg-yellow-400 text-white font-medium rounded-md hover:bg-yellow-500 transition flex items-center justify-center min-w-[100px]"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Add Task"
                  )}
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
        {isLoading ? (
          <div className="text-center py-8 text-yellow-400 flex justify-center">
            <LoaderCircle className="animate-spin text-3xl" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {isPastDate ? "No task added." : "Add a Task"}
          </div>
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
                  done={task.done}
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
    </>
  );
};
