import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/bin/action-yaml.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
});
