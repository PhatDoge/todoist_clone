import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
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
