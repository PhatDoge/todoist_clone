import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const userLabels = await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const systemLabels = await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("type"), "system"))
        .collect();

      return [...systemLabels, ...userLabels];
    }

    return [];
  },
});

export const getLabelByLabelId = query({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, { labelId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const label = await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("_id"), labelId))
        .collect();

      return label?.[0] || null;
    }

    return null;
  },
});

export const createALabel = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) return null;

      // Check for existing label
      const existing = await ctx.db
        .query("labels")
        .filter((q) =>
          q.and(q.eq(q.field("userId"), userId), q.eq(q.field("name"), name))
        )
        .first();

      if (existing) {
        console.log("Label already exists");
        return existing._id; // or return null
      }

      const newLabelId = await ctx.db.insert("labels", {
        userId,
        name,
        type: "user",
      });

      return newLabelId;
    } catch (err) {
      console.log("Error occurred during createALabel mutation", err);
      return null;
    }
  },
});
