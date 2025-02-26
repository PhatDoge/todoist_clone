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
  handleOnChange,
  _id,
}: {
  taskName: string;
  isCompleted: boolean;
  handleOnChange: () => void;
  _id: string;
}) => {
  return (
    <div
      key={_id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
            <Checkbox
              id="todo"
              className={clsx(
                "w-5 h-5 rounded-xl",
                isCompleted &&
                  "data-[state=checked]:bg-gray-300 border-gray-300"
              )}
              checked={isCompleted}
              onCheckedChange={handleOnChange}
            />
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                <div></div>
              </div>
            </DialogTrigger>
          </div>
        </div>

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
      </Dialog>
    </div>
  );
};

export default Task;
