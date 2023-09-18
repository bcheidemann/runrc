import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

await emptyDir("./dist/npm");

await build({
  entryPoints: [
    "./src/mod.ts",
    {
      kind: "bin",
      name: "runrc",
      path: "./src/main.ts",
    },
  ],
  outDir: "./dist/npm",
  shims: {
    deno: true,
  },
  package: {
    name: "runrc",
    version: Deno.args[0],
    description: "Configurable per-directory command aliases and scripts.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/bcheidemann/runrc.git",
    },
    bugs: {
      url: "https://github.com/bcheidemann/runrc/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "dist/npm/LICENSE");
    Deno.copyFileSync("README.md", "dist/npm/README.md");
  },
});

const playgroundInstall = new Deno.Command(
  "npm",
  {
    args: ["install"],
    cwd: "playground",
  },
);

console.log("Installing playground dependencies...");
const status = await playgroundInstall.spawn().status;

Deno.exit(status.code);
