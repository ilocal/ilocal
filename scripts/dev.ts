import { build } from "esbuild";
import { globPlugin } from "esbuild-plugin-glob";

// function buildPlugin(options) {
//   return {
//     name: "monorepo",
//     setup(build) {
//       build.
//     },
//   };
// }

build({
  entryPoints: ["packages/**/*.ts"],
  outdir: "packages/dist",
  plugins: [globPlugin()],
});
