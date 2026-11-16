import { createSignal, For, onSettled } from "solid-js";
import card from "virtual:sopicard";

/* Inline SVG icon set — zero network requests. stroke-based (lucide-style paths). */
// prettier-ignore — keep the icon table compact, one entry per line
const ICONS: Record<string, string> = {
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0-20"/><path d="M2 12h20"/>',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  x: '<path d="M4 4l16 16M20 4L4 20"/>',
  mastodon:
    '<path d="M21.6 13.2c-.3 1.6-2.8 3.4-5.7 3.7-1.5.2-3 .3-4.6.2-2.6-.1-4.6-.6-4.6-.6v.7c.3 2.3 2.3 2.5 4.2 2.6 1.9 0 3.6-.5 3.6-.5l.1 1.7s-1.3.7-3.7.9c-1.3.1-3-.1-4.9-.5C2.3 20.3 1.6 16 1.5 11.6c0-1.3 0-2.5 0-3.5 0-4.4 2.9-5.7 2.9-5.7C5.8 1.6 8.3 1.4 10.7 1.4h.1c2.4 0 4.9.2 6.3 1 0 0 2.9 1.3 2.9 5.7 0 0 0 3.2-.4 5.1z"/><path d="M18.2 8.5v5.6h-2.1V8.7c0-1.1-.5-1.7-1.4-1.7-1 0-1.6.7-1.6 2v2.9h-2.1V9c0-1.3-.6-2-1.6-2-.9 0-1.4.6-1.4 1.7v5.4H7.2V8.5c0-1.1.3-2 .9-2.6.6-.6 1.4-.9 2.4-.9 1.1 0 2 .4 2.5 1.3l.5.9.6-.9c.5-.9 1.4-1.3 2.5-1.3 1 0 1.8.3 2.4.9.6.6.7 1.5.7 2.6z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  vcard:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M5.5 16c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2"/><path d="M14 9h5M14 13h5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21v.01M18 18h3v3h-3z"/>',
  flip: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
};

/* Icons are sized with width/height attributes (1em), so no CSS is needed. */
function Icon(props: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      innerHTML={ICONS[props.name] ?? ICONS.link}
    />
  );
}

/* Links are "unscrapable": the prerendered HTML contains no mailto:/tel:/href.
 * The real target is assembled here, at runtime, only when clicked. */
function targetOf(link: (typeof card.links)[number]): string {
  switch (link.kind) {
    case "email":
      return `mailto:${link.user}@${link.domain}`;
    case "phone":
      return `tel:+${link.cc}${link.number}`;
    default:
      return link.value ?? "#";
  }
}
function displayOf(link: (typeof card.links)[number]): string {
  switch (link.kind) {
    case "email":
      return `${link.user}@${link.domain}`;
    case "phone":
      return `+${link.cc} ${(link.number ?? "").replace(/(\d{2})(?=\d)/g, "$1 ").trim()}`;
    default:
      return link.value ?? "";
  }
}

function LinkRow(props: { link: (typeof card.links)[number] }) {
  const [copied, setCopied] = createSignal(false);

  // Pending "copied" reset timer. onSettled registers the component's
  // disposal cleanup (the Solid 2.0 replacement for onMount/onCleanup pairs),
  // so a row that goes away can never write into an unmounted owner.
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;
  onSettled(() => () => clearTimeout(copiedTimer));

  const open = () => {
    const t = targetOf(props.link);
    if (props.link.kind === "url") window.open(t, "_blank", "noopener,noreferrer");
    else window.location.href = t;
  };
  const copy = async () => {
    const text = displayOf(props.link);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(setCopied, 1600, false);
  };

  // [role=group] is Pico's joined-button pair: the two .outline buttons share
  // a single border and split the row width.
  return (
    <div role="group">
      <button
        type="button"
        class="outline"
        onClick={open}
        aria-label={`${props.link.label} — open`}
      >
        <Icon name={props.link.icon} /> {props.link.label}
      </button>
      <button
        type="button"
        class="outline copy"
        onClick={copy}
        aria-label={`Copy ${props.link.label.toLowerCase()} to clipboard`}
      >
        <Icon name={copied() ? "check" : "copy"} />
      </button>
      <span role="status" class="visually-hidden">
        {copied() ? `${props.link.label} copied to clipboard` : ""}
      </span>
    </div>
  );
}

function MonogramAvatar() {
  return (
    <svg
      viewBox="0 0 96 96"
      width="96"
      height="96"
      role="img"
      aria-label={`Portrait monogram of ${card.name}`}
    >
      <defs>
        <linearGradient id="avatar-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color={card.accent} />
          <stop offset="1" stop-color={card.darkAccent} />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="46" fill="url(#avatar-g)" />
      <text
        x="48"
        y="60"
        text-anchor="middle"
        font-family="system-ui, sans-serif"
        font-size="38"
        font-weight="700"
        fill="#fff"
      >
        {card.initials}
      </text>
    </svg>
  );
}

export default function Card() {
  const [flipped, setFlipped] = createSignal(false);
  // The hint is shown until the card has been flipped once.
  const [hasFlipped, setHasFlipped] = createSignal(false);
  let frontBtn: HTMLButtonElement | undefined;
  let backBtn: HTMLButtonElement | undefined;

  const flip = (to: boolean) => {
    setFlipped(to);
    setHasFlipped(true);
    // Move focus to the newly revealed face's flip button for keyboard users.
    queueMicrotask(() => (to ? backBtn : frontBtn)?.focus({ preventScroll: true }));
  };

  // Clicking/tapping the card itself (outside buttons/links) also flips it.
  const onCardClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    flip(!flipped());
  };
  // Horizontal swipe flips too: left -> back, right -> front.
  let touchX = 0;
  const onTouchStart = (e: TouchEvent) => {
    touchX = e.changedTouches.item(0)?.clientX ?? 0;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const dx = (e.changedTouches.item(0)?.clientX ?? touchX) - touchX;
    if (Math.abs(dx) > 40) flip(dx < 0);
  };

  const base = import.meta.env.BASE_URL;

  return (
    <main itemscope itemtype="https://schema.org/ProfilePage">
      <meta itemprop="url" content={card.siteUrl} />
      <meta itemprop="name" content={`${card.name} — ${card.role}`} />
      {card.bio && <meta itemprop="description" content={card.bio} />}

      <div class="scene">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pointer-only convenience: clicking anywhere flips the card; keyboard users use the dedicated flip buttons */}
        <div
          class={["card", { "is-flipped": flipped() }]}
          onClick={onCardClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* ------------------------- FRONT ------------------------- */}
          <article
            class="face front"
            itemprop="mainEntity"
            itemscope
            itemtype="https://schema.org/Person"
            aria-label={`Business card front: ${card.name}, ${card.role}`}
            aria-hidden={flipped() ? "true" : "false"}
            inert={flipped()}
          >
            <div class="grid">
              {card.avatar.type === "image" ? (
                <img
                  src={`${base}${card.avatar.src.replace(/^\//, "")}`}
                  alt={card.avatar.alt}
                  width="96"
                  height="96"
                  fetchpriority="high"
                  itemprop="image"
                />
              ) : (
                <MonogramAvatar />
              )}
              <hgroup>
                <h1 itemprop="name">{card.name}</h1>
                <p>
                  <span itemprop="jobTitle">{card.role}</span>
                  {card.company && (
                    <>
                      {" · "}
                      <span
                        itemprop="worksFor"
                        itemscope
                        itemtype="https://schema.org/Organization"
                      >
                        <span itemprop="name">{card.company}</span>
                      </span>
                    </>
                  )}
                </p>
              </hgroup>
            </div>
            {card.location && (
              <p>
                <small>
                  <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                    <span itemprop="addressLocality">{card.location}</span>
                  </span>
                </small>
              </p>
            )}
            {card.bio && (
              <p>
                <small itemprop="description">{card.bio}</small>
              </p>
            )}
            <button
              ref={frontBtn}
              type="button"
              class="no-print"
              aria-pressed={flipped() ? "true" : "false"}
              onClick={() => flip(true)}
            >
              <Icon name="flip" /> Contact &amp; links
            </button>
            {/* monogram avatar has no src, expose an image URL for microdata */}
            {card.avatar.type === "monogram" && (
              <meta itemprop="image" content={`${card.siteUrl}/generated/og.svg`} />
            )}
            {/* machine-readable sameAs for public profiles (microdata) */}
            <For each={card.links.filter((l) => l.kind === "url")}>
              {(l) => <meta itemprop="sameAs" content={l.value} />}
            </For>
          </article>

          {/* ------------------------- BACK -------------------------- */}
          <article
            class="face back"
            aria-label="Business card back: contact links, QR code and save-contact"
            aria-hidden={flipped() ? "false" : "true"}
            inert={!flipped()}
          >
            {/* Top row mirrors the front's .grid: QR top-left where the
                avatar sits, save-contact + flip-back pinned top right. */}
            <div class="grid">
              <figure class="qr" role="img" aria-label={card.qrLabel} innerHTML={card.qrSvg} />
              <div class="side">
                <a role="button" href={`${base}generated/contact.vcf`} download="contact.vcf">
                  <Icon name="vcard" /> Save contact
                </a>
                <button
                  ref={backBtn}
                  type="button"
                  class="secondary outline no-print"
                  aria-pressed={flipped() ? "true" : "false"}
                  onClick={() => flip(false)}
                >
                  <Icon name="flip" /> Flip back
                </button>
              </div>
            </div>

            <div class="links">
              <For each={card.links}>{(link) => <LinkRow link={link} />}</For>
            </div>
          </article>
        </div>
      </div>

      {!hasFlipped() && (
        <p class="no-print">
          <small>Click or tap the card to flip it</small>
        </p>
      )}
    </main>
  );
}
