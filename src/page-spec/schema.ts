import { z } from "zod";

export const SectionTypeSchema = z.enum([
  "navbar",
  "hero",
  "features",
  "philosophy",
  "protocol",
  "membership",
  "footer",
  "benefits",
  "testimonial",
  "faq",
  "cta",
  "html",
]);

export const SectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  visible: z.boolean().default(true),
  props: z.record(z.string(), z.any()), // Permitir props genéricas para qualquer componente
});

export const ThemeSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid HEX"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid HEX"),
  fontFamily: z.string(),
  borderRadius: z.string(),
});

export const PageDataSchema = z.object({
  id: z.string().uuid().or(z.string()), // Accept any string for mock ids
  title: z.string(),
  slug: z.string(),
  language: z.string().default("pt-BR"),
  theme: ThemeSchema,
  sections: z.array(SectionSchema),
});

export const PageSpecSchema = z.object({
  schemaVersion: z.literal(1),
  page: PageDataSchema,
});

export type PageSpec = z.infer<typeof PageSpecSchema>;


