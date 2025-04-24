import React from "react";
import { Checkbox } from "../ui/checkbox";
import clsx from "clsx";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Doc } from "@/convex/_generated/dataModel";
import { AddTaskDialog } from "../add-tasks/add-task-dialog";
import { Calendar, GitBranch, Trash2Icon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import moment from "moment";

const Task = ({
  data,
  isCompleted,
  handleOnChange,
  showDetails = false,
}: {
  data: Doc<"todos"> | Doc<"subTodos">;
  isCompleted: boolean;
  taskName: string;
  showDetails?: boolean;
  handleOnChange: () => void;
}) => {
  const { taskName, dueDate, projectId } = data;
  const deleteASubTodoMutation = useMutation(api.subTodos.deleteASubTodo);

  const isSubTask = "parentId" in data;

  // Only query for subtodos if this is a parent task, not a subtask
  const subtodosTotal =
    !isSubTask ?
      useQuery(api.subTodos.getSubTodosByParentId, {
        parentId: data._id,
      })
    : null;

  const handleDeleteSubtodo = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dialog from opening
    if (isSubTask) {
      deleteASubTodoMutation({ taskId: data._id })
        .then(() => {
          toast.success("Subtarea eliminada exitosamente", {
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error("Error deleting subtodo:", error);
          toast.error("Error al eliminar la subtarea", {
            duration: 3000,
          });
        });
    }
  };

  return (
    <div
      key={data._id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-between w-full">
          <div className="flex gap-2 flex-grow">
            <Checkbox
              id="todo"
              className={clsx(
                "w-5 h-5 rounded-xl",
                isCompleted &&
                  "data-[state=checked]:bg-gray-300 border-gray-300"
              )}
              checked={isCompleted}
              onCheckedChange={handleOnChange}
            />
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                {showDetails && (
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center gap-1">
                      <GitBranch className="w-3 h-3 text-foreground/70" />
                      <p className="text-xs text-foreground/70">
                        {subtodosTotal?.length}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      <p className="text-xs text-primary">
                        {moment(dueDate).format("LL")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>

          {/* Delete button for subtasks */}
          {isSubTask && (
            <button
              onClick={handleDeleteSubtodo}
              className="flex items-center justify-center w-6 h-6 hover:bg-red-100 rounded-full transition-colors duration-200 group"
              title="Eliminar subtarea"
            >
              <Trash2Icon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            </button>
          )}

          {!isSubTask && <AddTaskDialog data={data} />}
        </div>
      </Dialog>
    </div>
  );
};

export default Task;
