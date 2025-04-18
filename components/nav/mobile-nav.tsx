"use client";

import { Hash, Menu, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import todovexLogo from "@/public/logo/todovex.svg";
import { primaryNavItems } from "@/utils";
import SearchForm from "./search-form";
import UserProfile from "./user-profile";
import AddLabelDialog from "../labels/add-label-dialog";
import AddProjectDialog from "../projects/add-project-dialog";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function MobileNav({
  navTitle = "",
  navLink = "#",
}: {
  navTitle?: string;
  navLink?: string;
}) {
  const pathname = usePathname();
  const projectList = useQuery(api.projects.getProjects);
  const [navItems, setNavItems] = useState([...primaryNavItems]);

  useEffect(() => {
    if (projectList) {
      const projectItems = projectList.map(({ _id, name }, idx) => ({
        ...(idx === 0 && { id: "projects" }),
        name,
        link: `/loggedin/projects/${_id.toString()}`,
        icon: <Hash className="w-4 h-4" />,
      }));
      setNavItems([...primaryNavItems, ...projectItems]);
    }
  }, [projectList]);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Activar navegación móvil</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <UserProfile />

            {navItems.map(({ name, icon, link, id }, idx) => (
              <div key={idx}>
                {/* Label section */}
                {id === "filters" && (
                  <div className="flex items-center justify-between mt-6 mb-2 px-3">
                    <p className="text-base">Filtros y etiquetas</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="outline">
                          <PlusIcon
                            className="h-5 w-5"
                            aria-label="Add a Label"
                          />
                        </Button>
                      </DialogTrigger>
                      <AddLabelDialog />
                    </Dialog>
                  </div>
                )}

                {/* Project section header */}
                {id === "projects" && (
                  <div className="flex items-center justify-between mt-6 mb-2 px-3">
                    <p className="text-base">Mis proyectos</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <AddProjectDialog />
                      </DialogTrigger>
                    </Dialog>
                  </div>
                )}

                <Link
                  href={link}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname === link ? "text-primary font-semibold" : ""
                  }`}
                >
                  {icon}
                  {name}
                </Link>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex items-center md:justify-between w-full gap-1 md:gap-2 py-2">
        <div className="lg:flex-1">
          <Link href={navLink}>
            <p className="text-sm font-semibold text-foreground/70 w-24">
              {navTitle}
            </p>
          </Link>
        </div>
        <div className="place-content-center w-full flex-1">
          <SearchForm />
        </div>
        <div className="place-content-center w-12 h-12 lg:w-16 lg:h-20">
          <Image alt="logo" src={todovexLogo} />
        </div>
      </div>
    </header>
  );
}
