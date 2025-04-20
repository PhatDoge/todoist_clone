"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon, Text } from "lucide-react";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { Calendar } from "../ui/calendar";
import { CardFooter } from "../ui/card";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  taskName: z.string().min(2, {
    message: "Tarea debe tener al menos 2 caracteres",
  }),
  description: z.string().optional(),
  priority: z.string().min(1, {
    message: "Porfavor seleccione una prioridad",
  }),
  projectId: z.string().min(2, {
    message: "Porfavor seleccione un proyecto",
  }),
  labelId: z.string().min(2, {
    message: "Porfavor seleccione una etiqueta",
  }),
  dueDate: z.date({
    required_error: "Porfavor seleccione una fecha",
  }),
});

export const AddTaskInline = ({
  setShowAddTask,
  parentTask,
}: {
  setShowAddTask: Dispatch<SetStateAction<boolean>>;
  parentTask?: Doc<"todos">;
}) => {
  const projectId = parentTask?.projectId || "k978m8nh1dmc71d5nqxz213j057b1csk";
  const labelId = parentTask?.labelId || "k574jkhbtndbby2xcvmxrxbv1h7b01wd";
  const priority = parentTask?.priority?.toString() || "1";
  const parentId = parentTask?._id;

  const labels = useQuery(api.labels.getLabels) ?? [];
  const projects = useQuery(api.projects.getProjectsByUser) ?? [];

  // const createATodoMutation = useMutation(api.todos.createATodo);
  const createASubTodoAndEmbeddings = useAction(
    api.subTodos.createSubTodoAndEmbeddings
  );

  const createTodoEmbeddings = useAction(api.todos.createTodoAndEmbeddings);

  const defaultValues = {
    taskName: "",
    description: "",
    priority: priority.toString(), // cast priority to string
    dueDate: new Date(),
    projectId,
    labelId,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { taskName, description, priority, dueDate, projectId, labelId } =
      data;

    if (projectId) {
      if (parentId) {
        const mutationID = createASubTodoAndEmbeddings({
          parentId,
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });
        if (mutationID != undefined) {
          toast.success("Subtarea creada con exito! 👽👻", { duration: 3000 });
          form.reset({
            ...defaultValues,
          });
        }
      } else {
        const mutationID = createTodoEmbeddings({
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });
        if (mutationID != undefined) {
          toast.success("Tarea creada con exito! 👽👻", { duration: 3000 });
          form.reset({
            ...defaultValues,
          });
        }
      }
    }
  }

  return (
    <div>
      {JSON.stringify(form.getValues(), null, 2)}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    id="taskName"
                    placeholder="Ingresa tu tarea"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-start gap-2">
                    <Text className="ml-auto h-4 w-4 opacity-50" />
                    <Textarea
                      id="description"
                      placeholder="Ingresa una descripción"
                      className="border-2 font-semibold text-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Added missing fields */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex gap-2 w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ?
                            format(field.value, "PPP")
                          : <span>Seleccione una fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* campos adicionales */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={priority}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4].map((item, idx) => (
                        <SelectItem key={idx} value={item.toString()}>
                          Prioridad {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labelId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={labelId || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una etiqueta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labels.map((label: Doc<"labels">, idx) => (
                        <SelectItem key={idx} value={label._id}>
                          {label.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={projectId || field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar un proyecto" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {projects.map((project: Doc<"projects">, idx) => (
                      <SelectItem key={idx} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
            <div className="w-full lg:w-1/4"></div>
            <div className="flex gap-3 self-end">
              <Button
                className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                variant="outline"
                onClick={() => setShowAddTask(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button className="px-6" type="submit">
                Agregar Tarea
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
};
