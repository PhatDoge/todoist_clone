import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const userProjects = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const systemProjects = await ctx.db.query("projects").collect();

      const combined = [...userProjects];

      for (const project of systemProjects) {
        if (!combined.some((p) => p._id === project._id)) {
          combined.push(project);
        }
      }

      return combined;
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
