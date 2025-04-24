"use client";

import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function AddProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger id="closeDialog">
        <PlusIcon className="h-5 w-5" aria-label="Add a Project" />
      </DialogTrigger>
      <AddProjectDialogContent />
    </Dialog>
  );
}

function AddProjectDialogContent() {
  const form = useForm({ defaultValues: { name: "" } });
  const router = useRouter();

  const createAProject = useMutation(api.projects.createAProject);

  const onSubmit = async ({ name }: any) => {
    if (!name || name.trim() === "") {
      toast.error("⚠️ El nombre del proyecto no puede estar vacío.", {
        duration: 3000,
      });
      return;
    }

    try {
      const projectId = await createAProject({ name });

      if (projectId) {
        toast.success("🚀 Creaste un projecto!", {
          duration: 3000,
        });
        form.reset({ name: "" });
        router.push(`/loggedin/projects/${projectId}`);
      } else {
        toast.error("❌ No se pudo crear el proyecto. Intenta de nuevo.", {
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("🚨 Ocurrió un error inesperado.", {
        description: (error as Error).message,
        duration: 4000,
      });
      console.error("Error creating project:", error);
    }
  };

  return (
    <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>Agrega un nuevo proyecto</DialogTitle>
        <DialogDescription className="capitalize">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20"
            >
              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Nombre del proyecto"
                          required
                          className="border-0 font-semibold text-lg"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="h-9 px-4 text-sm">
                  Crear
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
