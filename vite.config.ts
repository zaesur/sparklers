import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/sparklers/",
  plugins: [glsl()]
});
