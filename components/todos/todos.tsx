import { Doc } from "@/convex/_generated/dataModel";
import Task from "./task";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Todos({ items }: { items: Array<Doc<"todos">> }) {
  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChangeTodo = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ taskId: task._id });
    } else {
      checkATodo({ taskId: task._id });
    }
  };

  return items.map((task, idx) => (
    <Task
      key={task._id}
      {...task}
      handleOnChange={() => handleOnChangeTodo(task)}
    />
  ));
}
