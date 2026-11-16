import type { ParentProps } from "solid-js";
// `?inline` bakes the stylesheets (Pico + card styles, then print) into the
// HTML at build time: zero render-blocking requests, one document, perfect
// Lighthouse. print.scss comes second so its rules win the cascade in print.
import css from "../src/styles/global.scss?inline";
import printCss from "../src/styles/print.scss?inline";

export default function Layout(props: ParentProps) {
  return (
    <>
      <style innerHTML={css} />
      <style innerHTML={printCss} />
      {props.children}
    </>
  );
}
