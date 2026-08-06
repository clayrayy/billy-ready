import settings from "../content/settings/site.json";

interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  location: string;
  socialLinks: Array<{ label: string; href: string }>;
  ministryEvents: string[];
  ministryIncludes: string[];
}

export const site = settings as SiteSettings;
export const ministryEvents = settings.ministryEvents;
export const ministryIncludes = settings.ministryIncludes;
