import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "../ui/label";
import { Calendar, Flag, Hash, Tag } from "lucide-react";
import { format } from "date-fns";

export const AddTaskDialog = ({
  data: { taskName, isCompleted, description },
}: {
  data: Doc<"todos">;
}) => {
  const todoDetails = [
    {
      labelName: "Proyecto",
      value: "Empezemos",
      icon: <Hash className="w-4 h-4 text-primary" />,
    },
    {
      labelName: "Fecha de entrega",
      value: format("2025/12/31", " ddd MM yyyy"),
      icon: <Calendar className="w-4 h-4 text-primary" />,
    },
    {
      labelName: "Prioridad",
      value: "Empezemos",
      icon: <Flag className="w-4 h-4 text-primary" />,
    },
    {
      labelName: "Etiqueta",
      value: "Empezemos",
      icon: <Tag className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flew-row lg:justify-between text-right">
      <DialogHeader>
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <div
            key={`${value}=${idx}`}
            className="grid gap-2 p-4 border-b-2 w-full"
          >
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {icon}
              <p className="capitalize text-sm">Empezemos</p>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
};
