import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";
import { getEmbeddingsWithAI } from "./openai";
import { api } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }
    return [];
  },
});

export const getSubtodoDescriptionById = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))

        .collect();
    }
    return [];
  },
});

export const createASubTodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (
    ctx,
    {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    }
  ) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const newTaskId = await ctx.db.insert("subTodos", {
          parentId,
          userId,
          taskName,
          description,
          priority,
          dueDate,
          projectId,
          labelId,
          isCompleted: false,
          embedding,
        });
        return newTaskId;
      }
      return null;
    } catch (error) {
      console.log("Error creando un subtodo", error);
      return null;
    }
  },
});

export const checkASubTodo = mutation({
  args: { taskId: v.id("subTodos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: true });
    return newTaskId;
  },
});

export const unCheckASubTodo = mutation({
  args: { taskId: v.id("subTodos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: false });
    return newTaskId;
  },
});

export const completedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }

    return [];
  },
});

export const inCompletedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }

    return [];
  },
});

export const getSubTodosByParentId = query({
  args: { parentId: v.id("todos") },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .collect();
    }

    return [];
  },
});

export const getSubTodosByProjectId = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .collect();
    }

    return [];
  },
});

export const createSubTodoAndEmbeddings = action({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, parentId }
  ) => {
    const embedding = await getEmbeddingsWithAI(taskName);
    await ctx.runMutation(api.subTodos.createASubTodo, {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    });
  },
});

// Add this to subTodos.ts
export const deleteASubTodo = mutation({
  args: {
    taskId: v.id("subTodos"),
  },
  handler: async (ctx, { taskId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const deletedTaskId = await ctx.db.delete(taskId);
        return deletedTaskId;
      }
      return null;
    } catch (err) {
      console.log("Error occurred during deleteASubTodo mutation", err);
      return null;
    }
  },
});
