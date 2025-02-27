import React from "react";
import { Button } from "../ui/button";

export const AddTaskInline = ({
  setShowAddTask,
}: {
  setShowAddTask: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <div className="flex gap-3 self-end">
        <Button
          className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
          variant={"outline"}
          onClick={() => setShowAddTask(false)}
        >
          Cancelar
        </Button>
        <Button className="px-6" type="submit">
          Agregar Tarea
        </Button>
      </div>
    </div>
  );
};
