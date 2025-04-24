import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  Flag,
  Hash,
  Tag,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Task from "../todos/task";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { AddTaskWrapper } from "./add-task-button";
import SuggestMissingTask from "./suggest-task";
import { toast } from "sonner";

export const AddTaskDialog = ({ data }: { data: Doc<"todos"> }) => {
  const { _id, taskName, description, dueDate, priority, projectId, labelId } =
    data;
  const project = useQuery(api.projects.getProjectByProjectId, {
    projectId,
  });
  const label = useQuery(api.labels.getLabelByLabelId, {
    labelId,
  });
  const getSubTodo = useQuery(api.subTodos.get);

  const incompletedSubtodosByProject =
    useQuery(
      api.subTodos.inCompletedSubTodos,
      _id ? { parentId: _id } : "skip"
    ) ?? [];

  const completedSubtodosByProject =
    useQuery(
      api.subTodos.completedSubTodos,
      _id ? { parentId: _id } : "skip"
    ) ?? [];

  const [selectedSubtask, setSelectedSubtask] =
    useState<Doc<"subTodos"> | null>(null);

  const checkASubTodoMutation = useMutation(api.subTodos.checkASubTodo);

  const uncheckASubTodoMutation = useMutation(api.subTodos.unCheckASubTodo);

  const deleteATodoMutation = useMutation(api.todos.deleteATodo);

  const [todoDetails, setTodoDetails] = useState<
    {
      labelName: string;
      value: string | number | undefined;
      icon: JSX.Element;
    }[]
  >([]);

  useEffect(() => {
    const data = [
      {
        labelName: "Proyecto",
        value: project?.name,
        icon: <Hash className="w-4 h-4 text-primary" />,
      },
      {
        labelName: "Fecha de entrega",
        value: format(dueDate, "dd MMM yyyy"),
        icon: <Calendar className="w-4 h-4 text-primary" />,
      },
      {
        labelName: "Prioridad",
        value: priority,
        icon: <Flag className="w-4 h-4 text-primary" />,
      },
      {
        labelName: "Etiqueta",
        value: label?.name,
        icon: <Tag className="w-4 h-4 text-primary capitalize" />,
      },
      // {
      //   labelName: "Descripción",
      //   value: description,

      //   icon: <Tag className="w-4 h-4 text-primary" />,
      // },
    ];

    setTodoDetails(data);
  }, [project, label?.name, priority, dueDate]);
  const handleDeleteTodo = (e: any) => {
    e.preventDefault();
    const deletedId = deleteATodoMutation({ taskId: _id });
    if (deletedId !== undefined) {
      toast.success("Tarea eliminada exitosamente", {
        duration: 3000,
      });
    }
  };

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <p className="my-2 capitalize">{description}</p>

          <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg-gap-0">
            <div className="flex gap-1">
              <ChevronDown className="w-4 h-4 text-primary" />
              <p className="font-bold flex text-sm text-gray-900">Sub Tareas</p>
            </div>
            <div>
              <SuggestMissingTask
                projectId={projectId}
                taskName={taskName}
                description={description}
                parentId={_id}
                isSubTask={true}
              />
            </div>
          </div>

          {/* Scrollable subtasks container */}
          <div className="pl-4 overflow-auto max-h-[250px]">
            {incompletedSubtodosByProject.map((task) => (
              <Task
                taskName={task.taskName}
                key={task._id}
                data={task}
                isCompleted={task.isCompleted}
                handleOnChange={() =>
                  checkASubTodoMutation({ taskId: task._id })
                }
              />
            ))}

            <div className="pb-4">
              <AddTaskWrapper parentTask={data} />
            </div>

            {completedSubtodosByProject.map((task) => (
              <Task
                taskName={task.taskName}
                key={task._id}
                data={task}
                isCompleted={task.isCompleted}
                handleOnChange={() =>
                  uncheckASubTodoMutation({ taskId: task._id })
                }
              />
            ))}
          </div>
        </DialogDescription>
      </DialogHeader>

      {/* Side Details Section */}
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <div
            key={`${value}=${idx}`}
            className="grid gap-2 p-4 border-b-2 w-full"
          >
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {icon}
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
        <div className="w-full gap-2 grid p-4 justify-end">
          <form onSubmit={(e) => handleDeleteTodo(e)}>
            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200 group"
              title="Eliminar tarea"
            >
              <Trash2Icon className="w-5 h-5 text-red-500 group-hover:text-red-700 transition-colors duration-200" />
            </button>
          </form>
        </div>
      </div>
    </DialogContent>
  );
};
