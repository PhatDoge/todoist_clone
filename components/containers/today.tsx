"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { Dot, Loader2 } from "lucide-react";

import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import moment from "moment";

import "moment/locale/es"; // <-- Import Spanish locale

moment.locale("es"); // <-- Set moment to use Spanish

export default function Today() {
  const todos = useQuery(api.todos.get) ?? [];
  const todayTodos = useQuery(api.todos.todayTodos) ?? [];
  const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];

  if (todos === undefined || todayTodos === undefined) {
    <p>
      <Loader2 />
      Cargando...
    </p>;
  }
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Hoy</h1>
      </div>

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Tareas vencidas</p>
        <Todos items={overdueTodos} />
      </div>

      <AddTaskWrapper />

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex items-center border-b-2 text-sm p-2 border-gray-100">
          {moment(new Date()).format("LL")}
          <Dot />
          Hoy
          <Dot />
          {moment(new Date()).format("dddd")}
        </p>
        <Todos items={todayTodos} />
      </div>
    </div>
  );
}
