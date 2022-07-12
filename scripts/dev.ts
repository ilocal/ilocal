import { build } from "esbuild";
import { globPlugin } from "esbuild-plugin-glob";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const target = args._[0] || "client";

const pkg = `packages/${target}`;

build({
  entryPoints: [`${pkg}/**/*.ts`],
  watch: true,
  outbase: `${pkg}/src`,
  outdir: `${pkg}/dist`,
  plugins: [globPlugin()],
});
