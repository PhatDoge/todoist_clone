"use client";

import { AddTaskWrapper } from "@/components/add-tasks/add-task-button";
import SuggestMissingTask from "@/components/add-tasks/suggest-task";

import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import DeleteProject from "@/components/projects/delete-project";
import { CompletedTodos } from "@/components/todos/completed-todos";
import Todos from "@/components/todos/todos";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProjectIdPage() {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();

  const getComppletedTodosByProjectId =
    useQuery(api.todos.getCompletedTodosByProjectId, {
      projectId,
    }) ?? [];

  const getInCompletedTodosByProjectId =
    useQuery(api.todos.getInCompletedTodosByProjectId, {
      projectId,
    }) ?? [];

  const projectName = useQuery(api.projects.getProjectNameByProjectId, {
    projectId,
  });

  const projectsTodoTotal = useQuery(api.todos.getTodosTotalByProjectId, {
    projectId,
  });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav navTitle={"Mis proyectos"} navLink="/loggedin/projects" />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0">
              <h1 className="text-lg font-semibold md:text-2xl">
                {projectName || "Proyecto"}
              </h1>
              <div className="flex gap-6 lg:gap-12 items-center">
                <SuggestMissingTask projectId={projectId} />

                <DeleteProject
                  projectId={projectId}
                  trigger={
                    <Trash2Icon className="w-6 h-6 text-red-500 cursor-pointer" />
                  }
                />
              </div>
            </div>

            <Todos items={getInCompletedTodosByProjectId} />

            <div className="pb-6">
              <AddTaskWrapper projectId={projectId} />
            </div>
            <div className="flex gap-1 flex-col mt-4"></div>
            <Todos items={getComppletedTodosByProjectId} />
            <div className="flex items-center space-x-4 gap-2 border-b-2 border-gray-100 p-2 text-sm text-foreground/80">
              <CompletedTodos totalTodos={projectsTodoTotal} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
