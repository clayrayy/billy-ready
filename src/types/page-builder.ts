export type SectionTheme = "cream" | "paper" | "dark" | "gold";

export interface PageSeo {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface PageAction {
  label: string;
  href: string;
}

export interface PageHeroData {
  style: "home" | "standard" | "image";
  eyebrow?: string;
  title: string;
  accent?: string;
  subheading?: string;
  intro: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "center" | "right";
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
}

interface SectionBase {
  type: string;
  eyebrow?: string;
  heading?: string;
  theme?: SectionTheme;
}

export interface RichTextSection extends SectionBase {
  type: "richText";
  lead?: string;
  body: string;
  layout?: "split" | "centered" | "article";
}

export interface ImageTextSection extends SectionBase {
  type: "imageText";
  body: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  imagePosition?: "left" | "right";
  imageFit?: "cover" | "contain";
  action?: PageAction;
}

export interface QuoteSection extends SectionBase {
  type: "quote";
  quote: string;
  attribution?: string;
}

export interface GalleryImage {
  image: string;
  alt: string;
  caption?: string;
}

export interface GallerySection extends SectionBase {
  type: "gallery";
  intro?: string;
  columns?: "two" | "three";
  images: GalleryImage[];
}

export interface SongListSection extends SectionBase {
  type: "songList";
  intro?: string;
  limit?: number;
  showScripture?: boolean;
  action?: PageAction;
}

export interface FeatureListSection extends SectionBase {
  type: "featureList";
  intro?: string;
  source?: "ministryEvents" | "ministryIncludes" | "custom";
  items?: string[];
  style?: "numbered" | "checks" | "plain";
  action?: PageAction;
}

export interface RolesSection extends SectionBase {
  type: "roles";
  roles: string[];
  body?: string;
  action?: PageAction;
}

export interface StatementSection extends SectionBase {
  type: "statement";
  body: string;
}

export interface CallToActionSection extends SectionBase {
  type: "callToAction";
  body?: string;
  primaryAction: PageAction;
  secondaryAction?: PageAction;
}

export interface NewsletterSection extends SectionBase {
  type: "newsletter";
  body: string;
}

export interface BookingFormSection extends SectionBase {
  type: "bookingForm";
  body: string;
  contactNote?: string;
}

export interface ImageBannerSection extends SectionBase {
  type: "imageBanner";
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "center" | "right";
  height?: "short" | "medium" | "tall";
  body?: string;
  action?: PageAction;
}

export type PageSection =
  | RichTextSection
  | ImageTextSection
  | QuoteSection
  | GallerySection
  | SongListSection
  | FeatureListSection
  | RolesSection
  | StatementSection
  | CallToActionSection
  | NewsletterSection
  | BookingFormSection
  | ImageBannerSection;

export interface EditablePage {
  seo: PageSeo;
  hero: PageHeroData;
  sections: PageSection[];
}
