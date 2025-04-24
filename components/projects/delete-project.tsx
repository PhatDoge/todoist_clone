"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Id } from "@/convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";
import { toast } from "sonner";

export default function DeleteProject({
  projectId,
  trigger,
}: {
  projectId: Id<"projects">;
  trigger?: React.ReactNode;
}) {
  const form = useForm();
  const router = useRouter();

  // Query to check if project is a system project
  const isSystemProject = useQuery(api.projects.checkIfProjectIsSystem, {
    projectId,
  });

  const deleteProject = useAction(api.projects.deleteProjectAndItsTasks);

  const onSubmit = async () => {
    // If it's a system project, show warning and return
    if (isSystemProject || projectId === GET_STARTED_PROJECT_ID) {
      toast.warning("🤗 Proyecto protegido", {
        description: "Este proyecto del sistema no puede ser eliminado.",
        duration: 3000,
      });
      return;
    }

    try {
      await deleteProject({ projectId });

      toast.success("🗑️ Proyecto eliminado exitosamente", {
        duration: 3000,
      });
      router.push(`/loggedin/projects`);
    } catch (error) {
      toast.error("🚨 Error inesperado al eliminar el proyecto", {
        description: (error as Error).message,
        duration: 4000,
      });
    }
  };

  // Don't render anything if this is a system project
  if (isSystemProject === true) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <EllipsisIcon className="w-5 h-5 text-foreground hover:cursor-pointer" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="w-40 lg:w-56">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <button type="submit" className="flex gap-2 items-center">
              <Trash2 className="w-5 h-5 rotate-45 text-foreground/40" />
              Borrar proyecto
            </button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
