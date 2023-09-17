import { Diagnostic, DiagnosticsReporter } from "../cli/diagnostics.ts";
import { chalk, path } from "../deps.ts";
import { Config } from "./config.ts";
import { Err } from "./result.ts";
import { Result } from "./types.ts";

export async function list(
  diagnostics: DiagnosticsReporter,
): Promise<Result<void, Diagnostic>> {
  const configResult = await Config.loadFromFile(
    path.join(Deno.cwd(), ".runrc"),
  );

  if (configResult.error) {
    diagnostics.addAndEmit(configResult.error);
    return Err(configResult.error);
  }

  const config = configResult.value;

  const maxCommandNameLength = Math.max(
    ...config.options.commands.map((command) => command.name.length),
  );

  console.log(
    config.options.commands.map((command) =>
      `${chalk.bold(command.name)}${
        " ".repeat(maxCommandNameLength + 2 - command.name.length)
      }${chalk.gray.italic(`runrc ${command.alias}`)}`
    ).join("\n"),
  );

  Deno.exit(0);
}
