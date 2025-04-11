"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { Dot, Loader2 } from "lucide-react";

import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import moment from "moment";

import "moment/locale/es"; // <-- Import Spanish locale
import { todayTodos } from "@/convex/todos";

moment.locale("es"); // <-- Set moment to use Spanish

export default function Upcoming() {
  const groupedTodosByDate = useQuery(api.todos.groupTodosByDate) ?? [];
  const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];
  const todayTodos = useQuery(api.todos.todayTodos) ?? [];

  //     if (todos === undefined || todayTodos === undefined) {
  //       <p>
  //         <Loader2 />
  //         Cargando...
  //       </p>;
  //    }
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold md:text-2xl">Tareas próximas</p>
      </div>

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Tareas vencidas</p>
        <Todos items={overdueTodos} />
      </div>

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex items-center border-b-2 text-sm p-2 border-gray-100">
          {moment(new Date()).format("LL")}
          <Dot />
          Hoy
          <Dot />
          {moment(new Date()).format("dddd")}
        </p>
        <Todos items={todayTodos} />

        {Object.keys(groupedTodosByDate).map((dueDate) => {
          return (
            <div key={dueDate} className="mb-6">
              <p className="font-bold flex items-center text-sm">
                {moment(dueDate).format("LL")}
                <Dot />
                {moment(dueDate).format("dddd")}
              </p>
              <ul>
                <Todos items={groupedTodosByDate[dueDate]} />
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
