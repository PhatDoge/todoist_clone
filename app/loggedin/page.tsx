"use client";
import Tasks from "@/components/todovex/tasks";
import UserProfile from "@/components/todovex/user-profile";

export default function LoggedIn() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold ">Todovex</h1>
      <UserProfile />
      <Tasks />
    </main>
  );
}
