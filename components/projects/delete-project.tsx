import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Id } from "@/convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";
import { useToast } from "@/hooks/use-toast";

export default function DeleteProject({
  projectId,
  trigger,
}: {
  projectId: Id<"projects">;
  trigger?: React.ReactNode;
}) {
  const form = useForm({ defaultValues: { name: "" } });
  const { toast } = useToast();
  const router = useRouter();

  const deleteProject = useAction(api.projects.deleteProjectAndItsTasks);

  const onSubmit = async () => {
    if (projectId === GET_STARTED_PROJECT_ID) {
      toast({
        title: "🤗 Just a reminder",
        description: "System projects are protected from deletion.",
        duration: 3000,
      });
    } else {
      const deleteTaskId = await deleteProject({ projectId });

      if (deleteTaskId !== undefined) {
        toast({
          title: "🗑️ Successfully deleted a project",
          duration: 3000,
        });
        router.push(`/loggedin/projects`);
      }
    }
  };

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
            <button type="submit" className="flex gap-2">
              <Trash2 className="w-5 h-5 rotate-45 text-foreground/40" /> Borrar
              proyecto
            </button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
