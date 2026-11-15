import type { ParentProps } from "solid-js";
// `?inline` bakes the whole stylesheet (Pico + card styles) into the HTML at
// build time: zero render-blocking requests, one document, perfect Lighthouse.
import css from "../src/styles/global.scss?inline";

export default function Layout(props: ParentProps) {
  return (
    <>
      <style innerHTML={css} />
      {props.children}
    </>
  );
}
