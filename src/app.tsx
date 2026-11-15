import { SolidBaseRoot } from "@kobalte/solidbase/client";
import { createRouter } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";
import { pageRoutes } from "virtual:file-routes";

const Router = createRouter({
  routes: fileRoutes(pageRoutes),
  base: import.meta.env.BASE_URL,
});

export default function App() {
  return <Router>{(route) => <SolidBaseRoot>{route.children}</SolidBaseRoot>}</Router>;
}
