import { Diagnostic, DiagnosticsReporter } from "../cli/diagnostics.ts";
import { chalk, path } from "../deps.ts";
import { template } from "../template.ts";
import { Config } from "./config.ts";
import { Err } from "./result.ts";
import { Result } from "./types.ts";

export async function run(
  alias: string,
  args: string[],
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
  const command = config.options.commands.find((command) =>
    command.alias === alias
  );

  if (!command) {
    const error = Diagnostic.error(`Command ${chalk.italic(alias)} not found`);
    diagnostics.addAndEmit(error);
    const info = Diagnostic.info(
      `Available commands: ${
        config.options.commands.map((command) => command.alias).join(", ")
      }`,
    );
    diagnostics.addAndEmit(info);
    return Err(error);
  }

  const runner = command.runner ?? config.options.runner ??
    { command: "bash", args: ["-c"] };

  const script = template({ args: [alias, ...args] })(command.run);

  const cmd = new Deno.Command(
    runner.command,
    {
      args: [...runner.args, script],
    },
  );

  const status = await cmd.spawn().status;

  if (!status.success) {
    Deno.exit(status.code);
  }

  Deno.exit(0);
}
