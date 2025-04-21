import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function AddLabelDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const addLabelMutation = useMutation(api.labels.createALabel);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm({ defaultValues: { name: "" } });

  const onSubmit = async ({ name }: any) => {
    if (!name || name.trim() === "") {
      toast.error("⚠️ El nombre de la etiqueta no puede estar vacío.", {
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      const labelId: Id<"labels"> | null | undefined = await addLabelMutation({
        name,
      });

      if (labelId) {
        toast.success("🏷️ Etiqueta creada con éxito!", { duration: 3000 });
        form.reset({ name: "" });
        onSuccess(); // ← close the dialog
      } else {
        toast.error("❌ No se pudo crear la etiqueta. Intenta de nuevo.", {
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("🚨 Error inesperado al crear la etiqueta.", {
        description: (error as Error).message,
        duration: 4000,
      });
      console.error("Add label error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>Agrega una nueva etiqueta</DialogTitle>
        <DialogDescription className="capitalize">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nombre de la etiqueta"
                        required
                        className="border-0 font-semibold text-lg"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading}>
                {isLoading ?
                  <div className="flex gap-2 items-center">
                    <Loader className="h-5 w-5 animate-spin" />
                    Creando...
                  </div>
                : "Crear"}
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
