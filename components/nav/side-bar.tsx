"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/utils";
import { useQuery } from "convex/react";
import { Hash, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddLabelDialog from "../labels/add-label-dialog";
import AddProjectDialog from "../projects/add-project-dialog";
import { Dialog, DialogTrigger } from "../ui/dialog";
import UserProfile from "./user-profile";

export default function SideBar() {
  const pathname = usePathname();
  const projects = useQuery(api.projects.getProjectsByUser);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex justify-between h-14 items-center border-b p-1 lg:h-[60px] lg:px-2">
          <UserProfile />
        </div>

        <nav className="grid items-start px-1 text-sm font-medium lg:px-4">
          {/* Primary Navigation Items */}
          {primaryNavItems.map(({ name, icon, link, id }, idx) => (
            <div key={idx}>
              {/* Section Headers */}
              {id === "filters" && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-base">Filtros y etiquetas</p>
                  <Dialog>
                    <DialogTrigger>
                      <PlusIcon className="h-5 w-5" aria-label="Add a Label" />
                    </DialogTrigger>
                    <AddLabelDialog />
                  </Dialog>
                </div>
              )}

              {/* Navigation Links */}
              <Link
                href={link}
                className={cn(
                  "flex items-center gap-3 rounded-lg py-2 transition-all hover:text-primary",
                  pathname === link && "bg-primary/10 text-primary"
                )}
              >
                <span className="flex gap-2 items-center">
                  {icon}
                  <p>{name}</p>
                </span>
              </Link>
            </div>
          ))}

          {/* Fixed Projects Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Link
                href="/loggedin/projects"
                className="flex items-center gap-3 rounded-lg py-2 transition-all hover:text-primary"
              >
                <p className="text-base">Proyectos</p>
              </Link>

              <AddProjectDialog />
            </div>

            {/* Project List */}
            {projects?.length ?
              projects.map((project) => (
                <Link
                  key={project._id}
                  href={`/loggedin/projects/${project._id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg py-2 px-2 transition-all hover:text-primary",
                    pathname === `/loggedin/projects/${project._id}` &&
                      "bg-primary/10 text-primary"
                  )}
                >
                  <Hash className="w-4 h-4" />
                  <p>{project.name}</p>
                </Link>
              ))
            : <p className="text-muted-foreground text-sm px-2">
                No tienes proyectos aún.
              </p>
            }
          </div>
        </nav>

        {/* Upgrade Card */}
        {/* <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
