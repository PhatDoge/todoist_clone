"use client";
import Tasks from "@/components/todovex/tasks";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold ">Todovex</h1>
      <Button>hola</Button>
      <Tasks />
    </main>
  );
}
