"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ClipboardEdit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateProject({
  projectId,
  name,
}: {
  projectId: Id<"projects">;
  name: string;
}) {
  const form = useForm({
    defaultValues: {
      name: name ?? "",
    },
  });

  const updateProject = useMutation(api.projects.updateProject);

  const onSubmit = async (data: { name: string }) => {
    if (data.name.length > 0) {
      try {
        await updateProject({
          projectId,
          name: data.name,
        });

        toast.success("✏️ Proyecto editado exitosamente", {
          duration: 3000,
        });
        form.reset({ name: "" });
        // Staying on the same page is better for UX after editing
        // Only refresh if needed instead of redirecting
      } catch (error) {
        toast.error("🚨 Error inesperado al editar el proyecto", {
          description: (error as Error).message,
          duration: 4000,
        });
      }
    } else {
      toast.error("⚠️ El nombre del proyecto no puede estar vacío.", {
        duration: 3000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <ClipboardEdit className="w-7 h-7 text-foreground/40 text-orange-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="w-40 lg:w-56">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <label className="flex gap-2 items-center" htmlFor="name">
              <input
                id="name"
                type="text"
                placeholder="Nombre del proyecto"
                className="input border border-solid border-foreground/20 rounded-md px-2 py-1 text-sm w-full"
                {...form.register("name")}
              />
            </label>
            <button type="submit" className="btn btn-sm mt-2 w-full">
              Guardar
            </button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
