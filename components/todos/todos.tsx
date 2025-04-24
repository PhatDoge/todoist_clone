import { Doc } from "@/convex/_generated/dataModel";
import Task from "./task";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner"; // Import sonner toast

export default function Todos({
  items,
  showDetails = false,
}: {
  showDetails?: boolean;
  items: Array<Doc<"todos">>;
}) {
  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChangeTodo = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ taskId: task._id });
      toast.info(`Tarea "${task.taskName}" marcada como pendiente ❌`, {
        duration: 2000,
      });
    } else {
      checkATodo({ taskId: task._id });
      toast.success(`Tarea "${task.taskName}" completeda yay!! 🎉`, {
        duration: 4000,
      });
    }
  };

  return items.map((task: Doc<"todos">) => (
    <Task
      taskName={task.taskName}
      isCompleted={task.isCompleted}
      key={task._id}
      data={task}
      showDetails={showDetails}
      handleOnChange={() => handleOnChangeTodo(task)}
    />
  ));
}
