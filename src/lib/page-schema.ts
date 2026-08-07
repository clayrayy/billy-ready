import { z } from "astro/zod";
import type { EditablePage } from "../types/page-builder";

const theme = z.enum(["cream", "paper", "dark", "gold"]);
const link = z.string().regex(/^(\/|https:\/\/|mailto:|tel:)/, "Use an internal /path or a complete secure URL.");
const action = z.object({
  label: z.string().min(1),
  href: link,
});
const optionalAction = z.preprocess((value) => {
  if (value == null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) return value;

  const candidate = value as Record<string, unknown>;
  const labelIsEmpty = typeof candidate.label !== "string" || candidate.label.trim() === "";
  const hrefIsEmpty = typeof candidate.href !== "string" || candidate.href.trim() === "";

  return labelIsEmpty && hrefIsEmpty ? undefined : value;
}, action.optional());
const common = {
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  theme: theme.optional(),
};

const sections = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("richText"),
    ...common,
    lead: z.string().optional(),
    body: z.string().min(1),
    layout: z.enum(["split", "centered", "article"]).optional(),
  }),
  z.object({
    type: z.literal("imageText"),
    ...common,
    body: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().min(4, "Describe the image for accessibility."),
    imageCaption: z.string().optional(),
    imagePosition: z.enum(["left", "right"]).optional(),
    imageFit: z.enum(["cover", "contain"]).optional(),
    action: optionalAction,
  }),
  z.object({
    type: z.literal("quote"),
    ...common,
    quote: z.string().min(1),
    attribution: z.string().optional(),
  }),
  z.object({
    type: z.literal("gallery"),
    ...common,
    intro: z.string().optional(),
    columns: z.enum(["two", "three"]).optional(),
    images: z.array(z.object({
      image: z.string().min(1),
      alt: z.string().min(4, "Describe each gallery image for accessibility."),
      caption: z.string().optional(),
    })).min(1),
  }),
  z.object({
    type: z.literal("songList"),
    ...common,
    intro: z.string().optional(),
    limit: z.number().int().nonnegative().optional(),
    showScripture: z.boolean().optional(),
    action: optionalAction,
  }),
  z.object({
    type: z.literal("featureList"),
    ...common,
    intro: z.string().optional(),
    source: z.enum(["ministryEvents", "ministryIncludes", "custom"]).default("custom"),
    items: z.array(z.string().min(1)).optional(),
    style: z.enum(["numbered", "checks", "plain"]).optional(),
    action: optionalAction,
  }).refine((section) => section.source !== "custom" || Boolean(section.items?.length), {
    message: "A custom feature list needs at least one item.",
    path: ["items"],
  }),
  z.object({
    type: z.literal("roles"),
    ...common,
    roles: z.array(z.string().min(1)).min(1),
    body: z.string().optional(),
    action: optionalAction,
  }),
  z.object({
    type: z.literal("statement"),
    ...common,
    body: z.string().min(1),
  }),
  z.object({
    type: z.literal("callToAction"),
    ...common,
    body: z.string().optional(),
    primaryAction: action,
    secondaryAction: optionalAction,
  }),
  z.object({
    type: z.literal("newsletter"),
    ...common,
    heading: z.string().min(1),
    body: z.string().min(1),
  }),
  z.object({
    type: z.literal("bookingForm"),
    ...common,
    heading: z.string().min(1),
    body: z.string().min(1),
    contactNote: z.string().optional(),
  }),
  z.object({
    type: z.literal("imageBanner"),
    ...common,
    image: z.string().min(1),
    imageAlt: z.string().min(4, "Describe the banner image for accessibility."),
    imagePosition: z.enum(["left", "center", "right"]).optional(),
    height: z.enum(["short", "medium", "tall"]).optional(),
    body: z.string().optional(),
    action: optionalAction,
  }),
]);

const editablePageSchema = z.object({
  seo: z.object({
    title: z.string().min(1).max(70),
    description: z.string().min(50).max(200),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }).refine((seo) => !seo.image || Boolean(seo.imageAlt), {
    message: "A sharing image needs an image description.",
    path: ["imageAlt"],
  }),
  hero: z.object({
    style: z.enum(["home", "standard", "image"]),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    accent: z.string().optional(),
    subheading: z.string().optional(),
    intro: z.string().min(1),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imagePosition: z.enum(["left", "center", "right"]).optional(),
    primaryAction: optionalAction,
    secondaryAction: optionalAction,
  }).refine((hero) => hero.style !== "image" || Boolean(hero.image && hero.imageAlt), {
    message: "An image-style hero needs both an image and an image description.",
    path: ["image"],
  }),
  sections: z.array(sections).min(1),
});

export const parseEditablePage = (input: unknown): EditablePage => editablePageSchema.parse(input) as EditablePage;
