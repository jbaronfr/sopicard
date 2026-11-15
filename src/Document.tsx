import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";
import card from "virtual:sopicard";

export default function Document(props: ParentProps) {
  const base = import.meta.env.BASE_URL;
  const title = `${card.name} — ${card.role}`;
  const description =
    card.bio ??
    `${card.name}, ${card.role}${card.company ? ` at ${card.company}` : ""}. Digital business card.`;
  // Theme CSS variables generated from card.config.ts (accent, backgrounds).
  const themeVars = `:root{--accent:${card.accent};--accent-dark:${card.darkAccent};--bg-light:${card.bgLight};--bg-dark:${card.bgDark};color-scheme:light dark;}`;

  return (
    <html lang={card.lang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content={card.accent} />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content={card.bgDark} />
        <meta name="description" content={description} />
        <link rel="canonical" href={card.siteUrl} />
        <link rel="icon" type="image/svg+xml" href={`${base}generated/favicon.svg`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={card.siteUrl} />
        <meta property="og:image" content={`${card.siteUrl}/generated/og.svg`} />
        <meta property="og:locale" content={card.lang.replace("-", "_")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${card.siteUrl}/generated/og.svg`} />
        {card.avatar.type === "image" && (
          <link rel="preload" as="image" href={`${base}${card.avatar.src.replace(/^\//, "")}`} />
        )}
        <style innerHTML={themeVars} />
        <script type="application/ld+json" innerHTML={card.jsonLd} />
        <HydrationScript />
      </head>
      <body>
        <div id="app">{props.children}</div>
      </body>
    </html>
  );
}
