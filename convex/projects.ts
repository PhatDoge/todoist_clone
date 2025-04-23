import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const getProjectsByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const userProjects = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const systemProjects = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("type"), "system"))
        .collect();

      // Combine user projects and system projects without deduplication
      return [...systemProjects, ...userProjects];
    }
    return [];
  },
});

export const getProjectByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const project = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("_id"), projectId))
        .collect();

      return project?.[0] || null;
    }

    return null;
  },
});

// convex/projects.ts

// export const getProjectsByUser = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) return [];

//     const userId = identity.subject;

//     const projects = await ctx.db
//       .query("projects")
//       .filter((q) => q.eq(q.field("userId"), userId))
//       .collect();

//     return projects;
//   },
// });

export const getProjectNameByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const project = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("_id"), projectId))
        .collect();

      return project?.[0]?.name || "no hay nombre";
    }

    return null;
  },
});

export const createAProject = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const newTaskId = await ctx.db.insert("projects", {
          userId,
          name,
          type: "user",
        });
        return newTaskId;
      }

      return null;
    } catch (err) {
      console.log("Error occurred during createAProject mutation", err);

      return null;
    }
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const taskId = await ctx.db.delete(projectId);
        //query todos and map through them and delete

        return taskId;
      }

      return null;
    } catch (err) {
      console.log("Error occurred during deleteProject mutation", err);

      return null;
    }
  },
});

export const deleteProjectAndItsTasks = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    try {
      // Get all todos for this project
      const allTodos = await ctx.runQuery(api.todos.getTodosByProjectId, {
        projectId,
      });

      // Get all subtodos for this project
      const allSubTodos = await ctx.runQuery(
        api.subTodos.getSubTodosByProjectId,
        {
          projectId,
        }
      );

      // Delete all subtodos first
      const subTodoPromises = Promise.allSettled(
        allSubTodos.map(async (subTask: Doc<"subTodos">) =>
          ctx.runMutation(api.subTodos.deleteASubTodo, {
            taskId: subTask._id,
          })
        )
      );
      await subTodoPromises;

      // Delete all todos
      const todoPromises = Promise.allSettled(
        allTodos.map(async (task: Doc<"todos">) =>
          ctx.runMutation(api.todos.deleteATodo, {
            taskId: task._id,
          })
        )
      );
      await todoPromises;

      // Finally delete the project itself
      await ctx.runMutation(api.projects.deleteProject, {
        projectId,
      });

      return { success: true };
    } catch (err) {
      console.error("Error deleting tasks, subtasks and project", err);
      return { success: false, error: err };
    }
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
  },
  handler: async (ctx, { projectId, name }) => {
    try {
      const userId = await handleUserId(ctx);

      if (!userId) {
        throw new Error("Unauthorized: User not authenticated");
      }

      // Verify the project exists and belongs to this user
      const project = await ctx.db.get(projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (project.userId !== userId && project.type !== "system") {
        throw new Error("Unauthorized: Not your project");
      }

      // Update the project name
      const updatedProjectId = await ctx.db.patch(projectId, {
        name: name,
      });

      return updatedProjectId;
    } catch (err) {
      console.log("Error occurred during updateProject mutation", err);
      throw err;
    }
  },
});
