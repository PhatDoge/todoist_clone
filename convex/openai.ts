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
    const trimmedTodos = todos.slice(0, 20); // adjust based on average token size
    const taskList = trimmedTodos.map((t) => `- ${t.taskName}`).join("\n");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm managing a project and need help finding one missing to-do. I have a list of tasks in JSON (taskName, description) and the project name: projectName Suggest 1 new to-do not already on the list. Return it as a JSON array under the todos key, using the same format.⚠️ Avoid duplicates 🗣️ Use the same language as the original to-dos",
        },
        {
          role: "user",
          content: `Here are the current tasks:\n${taskList}\nWhat tasks are missing?`,
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
        const AI_LABEL_ID = "k57at4b6x9a5r09wgd5ty5p23s7e51ec";
        const { taskName, description } = items[i];
        const embedding = await getEmbeddingsWithAI(
          `${taskName} - ${description}`
        );
        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID as Id<"labels">,
          embedding,
        });
      }
    }
  },
});
export const suggestMissingSubItemsWithAi = action({
  args: {
    projectId: v.id("projects"),
    parentId: v.id("todos"),
    taskName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { projectId, parentId, taskName, description }) => {
    //retrieve todos for the user
    const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
      parentId,
    });

    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId,
    });

    const projectName = project?.name || "";

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 2 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
            ...{ parentTodo: { taskName, description } },
          }),
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

    //create the todos
    if (messageContent) {
      const items = JSON.parse(messageContent)?.todos ?? [];

      for (let i = 0; i < items.length; i++) {
        const AI_LABEL_ID = "k57at4b6x9a5r09wgd5ty5p23s7e51ec";
        const { taskName, description } = items[i];
        const embedding = await getEmbeddingsWithAI(taskName);
        await ctx.runMutation(api.subTodos.createASubTodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          parentId,
          labelId: AI_LABEL_ID as Id<"labels">,
          embedding,
        });
      }
    }
  },
});

export const getEmbeddingsWithAI = async (searchText: string) => {
  if (!apiKey) throw new Error("Open AI Key is not defined");

  const cleanedText = searchText.trim();
  if (!cleanedText) throw new Error("Search text is empty or whitespace");

  const req = {
    input: cleanedText,
    model: "text-embedding-ada-002",
    encoding_format: "float",
  };

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`OpenAI Error, ${msg}`);
  }

  const json = await response.json();
  const vector = json["data"][0]["embedding"];

  console.log(`Embedding of "${searchText}": ${vector.length} dimensions`);

  return vector;
};
