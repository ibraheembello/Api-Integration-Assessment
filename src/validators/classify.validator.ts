import { z } from "zod";

export const classifySchema = z.object({
  query: z.object({
    name: z.string({
      error: "name must be a string",
    }).min(1, "Missing or empty name parameter"),
  }),
});
