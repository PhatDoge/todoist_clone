import React from "react";
import { Checkbox } from "../ui/checkbox";
import clsx from "clsx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const Task = ({
  taskName,
  isCompleted,
  onChange,
  key,
}: {
  taskName: string;
  isCompleted: boolean;
  onChange: () => void;
  key: string;
}) => {
  return (
    <Dialog>
      <div key={key} className="flex items-center space-x-2">
        <Checkbox
          id="todo"
          className={clsx(
            "w-5 h-5 rounded-xl",
            isCompleted && "data-[state=checked]:bg-gray-300 border-gray-300"
          )}
          checked={isCompleted}
          onCheckedChange={onChange}
        />
        <DialogTrigger asChild>
          <div className="flex flex-col items-start cursor-pointer">
            <button
              className={clsx(
                "text-sm font-normal text-left",
                isCompleted && "line-through text-foreground/30"
              )}
            >
              {taskName}
            </button>
          </div>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          <div>
            <p>This is your task: {taskName}</p>
            <p>Status: {isCompleted ? "Completed" : "Pending"}</p>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default Task;
