// deno-lint-ignore-file no-fallthrough
import { chalk } from "./deps.ts";
import { error, RunConfig } from "./lib.ts";

function usage() {
  console.log(chalk.bold("Usage: ") + chalk.italic("run <alias>"));
  console.log("");
}

async function main() {
  const config = new RunConfig();
  await config.load();

  const alias = Deno.args.at(0);

  if (!alias) {
    // Log usage
    error("No alias provided");
    console.log("");
    usage();
    Deno.exit(1);
  }

  switch (alias) {
    case "--help":
    case "-h":
      usage();
      Deno.exit(0);
    case "--list-commands":
    case "-l":
      config.listCommands();
      Deno.exit(0);
  }

  const exitCode = await config.runCommand(alias);

  Deno.exit(exitCode);
}

main();
