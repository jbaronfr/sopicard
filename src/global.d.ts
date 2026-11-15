/// <reference types="vite/client" />
/// <reference types="@kobalte/solidbase/types" />

declare module "virtual:sopicard" {
  interface SopicardAvatarImage {
    type: "image";
    src: string;
    alt: string;
  }
  interface SopicardAvatarMonogram {
    type: "monogram";
  }
  interface SopicardLink {
    kind: "email" | "phone" | "url";
    label: string;
    icon: string;
    user?: string;
    domain?: string;
    cc?: string;
    number?: string;
    value?: string;
  }
  interface SopicardData {
    siteUrl: string;
    lang: string;
    name: string;
    role: string;
    company: string | null;
    location: string | null;
    bio: string | null;
    initials: string;
    accent: string;
    darkAccent: string;
    bgLight: string;
    bgDark: string;
    avatar: SopicardAvatarImage | SopicardAvatarMonogram;
    qrSvg: string;
    qrLabel: string;
    links: SopicardLink[];
    jsonLd: string;
  }
  const data: SopicardData;
  export default data;
}

declare module "*.css?inline" {
  const css: string;
  export default css;
}

declare module "*.scss?inline" {
  const css: string;
  export default css;
}
