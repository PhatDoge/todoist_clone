import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

export default function AddLabelDialog({
  onSuccess,
  onOpenChange,
}: {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const addLabelMutation = useMutation(api.labels.createALabel);
  const [isLoading, setIsLoading] = useState(false);

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
        onSuccess(); // Call any success callback from parent
        onOpenChange(false); // Close the dialog
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
                          placeholder="Nombre de la etiqueta"
                          required
                          className="border-0 font-semibold text-lg"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-9 px-4 text-sm"
                >
                  {isLoading ?
                    <div className="flex gap-2 items-center">
                      <Loader className="h-4 w-4 animate-spin" />
                      Creando...
                    </div>
                  : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
