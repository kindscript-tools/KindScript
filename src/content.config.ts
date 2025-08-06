import { defineCollection, z } from "astro:content";

const scripts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = {
  scripts,
};
