import { CircleCheckBig } from "lucide-react";
import React from "react";

export const CompletedTodos = ({ totalTodos }: { totalTodos: any }) => {
  return (
    <div className="flex items-center gap-1 border-b-2 p-2 border-gray-100 text-sm text-foreground/80">
      <>
        <CircleCheckBig />
        <span>+ {totalTodos}</span>
        {totalTodos === 1 ?
          <span className="capitalize">Tarea Completada</span>
        : <span className="capitalize">Tareas Completadas</span>}
      </>
    </div>
  );
};
