import "svelte";
import App from "./App.svelte";
import { GlobalCSS } from "figma-plugin-ds-svelte";

const app = new App({
  target: document.body,
});

export default app;
