import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const songs = defineCollection({
  loader: glob({ base: "./src/content/songs", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    scripture: z.string().optional(),
    order: z.number(),
    listenUrl: z.preprocess((value) => value || undefined, z.url().optional()),
  }),
});

export const collections = { songs };
