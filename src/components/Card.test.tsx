import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import Card from "./Card";

/** Flip to the back face, where links, QR and the vCard download live. */
async function flipToBack(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /contact & links/i }));
}

it("never exposes contact targets in the DOM (anti-scraping guarantee)", () => {
  const { container } = render(() => <Card />);
  // Both faces are always in the DOM (the flip is pure CSS), so a single
  // check covers the prerendered markup end to end: targets are assembled
  // from config parts at click time only, so they must not exist as text
  // anywhere either.
  expect(container.innerHTML).not.toMatch(/mailto:|tel:/i);
  expect(container.innerHTML).not.toContain("test@example.com");
  expect(container.innerHTML).not.toContain("+447700900123");
});

it("flips on card click, moving inert between the faces", async () => {
  const user = userEvent.setup();
  const { container } = render(() => <Card />);
  const cardEl = container.querySelector<HTMLElement>(".card")!;
  const front = container.querySelector<HTMLElement>(".face.front")!;
  const back = container.querySelector<HTMLElement>(".face.back")!;

  expect(cardEl.classList.contains("is-flipped")).toBe(false);
  // Solid 2.0 boolean attributes are presence/absence: inert lands on the
  // hidden face only, exactly as the prerendered HTML does.
  expect(front.hasAttribute("inert")).toBe(false);
  expect(back.hasAttribute("inert")).toBe(true);
  expect(screen.getByText(/click or tap the card to flip/i)).toBeInTheDocument();

  await user.click(cardEl);

  expect(cardEl.classList.contains("is-flipped")).toBe(true);
  expect(front.hasAttribute("inert")).toBe(true);
  expect(back.hasAttribute("inert")).toBe(false);
  // the hint is shown until the card has been flipped once
  expect(screen.queryByText(/click or tap the card to flip/i)).toBeNull();
});

it("flip buttons carry state and move focus to the revealed face", async () => {
  const user = userEvent.setup();
  render(() => <Card />);

  const frontBtn = screen.getByRole("button", { name: /contact & links/i });
  expect(frontBtn.getAttribute("aria-pressed")).toBe("false");
  await user.click(frontBtn);

  expect(frontBtn.getAttribute("aria-pressed")).toBe("true");
  // the front face is now aria-hidden → its button leaves the a11y tree
  expect(screen.queryByRole("button", { name: /contact & links/i })).toBeNull();
  const backBtn = screen.getByRole("button", { name: /flip back/i });
  expect(backBtn.getAttribute("aria-pressed")).toBe("true");
  expect(backBtn).toHaveFocus();

  await user.click(backBtn);
  expect(backBtn.getAttribute("aria-pressed")).toBe("false");
  expect(screen.getByRole("button", { name: /contact & links/i })).toHaveFocus();
});

it("copies assembled contact data to the clipboard and announces it", async () => {
  // userEvent.setup() installs a working navigator.clipboard stub, so the
  // copy flow can be asserted end to end without any extra mocking.
  const user = userEvent.setup();
  render(() => <Card />);
  await flipToBack(user);

  const copyEmail = screen.getByRole("button", { name: /copy email to clipboard/i });
  const emailStatus = copyEmail.closest("div")!.querySelector('span[role="status"]')!;
  await user.click(copyEmail);
  // the address is assembled from config parts only at this moment
  expect(await navigator.clipboard.readText()).toBe("test@example.com");
  await vi.waitFor(() => expect(emailStatus).toHaveTextContent(/email copied to clipboard/i));

  const copyCall = screen.getByRole("button", { name: /copy call to clipboard/i });
  await user.click(copyCall);
  expect(await navigator.clipboard.readText()).toBe("+44 77 00 90 01 23");

  // the copied indication auto-resets via the row's tracked timer (1.6s)
  await new Promise((resolve) => setTimeout(resolve, 1700));
  expect(emailStatus).toHaveTextContent("");
});

it("links the vCard download to the generated file", async () => {
  const user = userEvent.setup();
  render(() => <Card />);
  await flipToBack(user);

  const save = screen.getByRole("button", { name: /save contact/i });
  expect(save.getAttribute("href")).toBe("/generated/contact.vcf");
  expect(save.getAttribute("download")).toBe("contact.vcf");
});
