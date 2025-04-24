"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Hash, Trash2Icon } from "lucide-react";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const LabelList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const labels = useQuery(api.labels.getLabels);
  const deleteALabel = useMutation(
    api.labels.deleteALabel
  ).withOptimisticUpdate((localStore, { labelId }) => {
    const currentLabels = localStore.getQuery(api.labels.getLabels, {});
    if (currentLabels) {
      localStore.setQuery(
        api.labels.getLabels,
        {},
        currentLabels.filter((label) => label._id !== labelId)
      );
    }
  });

  const [deletingLabelId, setDeletingLabelId] = useState<Id<"labels"> | null>(
    null
  );

  const handleConfirmDelete = async () => {
    if (!deletingLabelId) return;

    try {
      await deleteALabel({ labelId: deletingLabelId });
      toast.success("Etiqueta eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la etiqueta");
    } finally {
      setDeletingLabelId(null);
    }
  };

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Etiquetas</h1>
      </div>

      <div className="flex flex-col gap-1 py-4">
        <AnimatePresence>
          {labels?.map((label) => (
            <motion.div
              key={label._id}
              initial={{ opacity: 1, height: "auto" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between border-b-2 p-2 border-gray-100"
            >
              <div className="flex items-center space-x-2">
                <Hash className="text-primary w-5 h-5" />
                <Label className="hover:cursor-pointer text-base font-normal">
                  {label.name}
                </Label>
              </div>
              {/* Only show delete button if label is not a system label */}
              {label.type !== "system" && (
                <button
                  onClick={() => setDeletingLabelId(label._id)}
                  className="flex items-center justify-center w-6 h-6 hover:bg-red-100 rounded-full transition-colors duration-200 group"
                  title="Eliminar etiqueta"
                >
                  <Trash2Icon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog
        open={!!deletingLabelId}
        onOpenChange={(open) => !open && setDeletingLabelId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Quieres eliminar esta etiqueta
              permanentemente?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingLabelId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabelList;
