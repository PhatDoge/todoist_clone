"use server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import OpenAI from "openai";
import { Id } from "./_generated/dataModel";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

export const suggestMissingItemsWithAi = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    // retrieve todos to user
    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId,
    });
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 1 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions. make sure to answer in the same lenguage as the todos are writen",
        },
        {
          role: "user",
          content: JSON.stringify(todos),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-3.5-turbo",
    });

    console.log(response.choices[0]);

    const messageContent = response.choices[0].message?.content;

    console.log({ messageContent });

    // create the todos with the response
    if (messageContent) {
      const items = JSON.parse(messageContent)?.todos ?? [];

      for (let i = 0; i < items.length; i++) {
        const { taskName, description } = items[i];
        const AI_LABEL_ID = "k57at4b6x9a5r09wgd5ty5p23s7e51ec";

        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID as Id<"labels">,
        });
      }
    }
  },
});
