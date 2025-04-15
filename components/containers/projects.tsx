import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Hash } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";

const ProjectList = () => {
  const projects = useQuery(api.projects.getProjects);

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projectos</h1>
      </div>

      <div className="flex flex-col gap-1 py-4">
        {projects?.map((project) => (
          <Link href={`/loggedin/projects/${project._id}`} key={project._id}>
            <div className="flex items-center space-x-2 border-b-2 p-2 border-gray-100">
              <Hash className="text-primary w-5 h-5" />
              <Label
                className="hover:cursor-pointer text-base font-normal"
                htmlFor="projects"
              >
                {project.name}
              </Label>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
