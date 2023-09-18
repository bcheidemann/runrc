import "npm:@total-typescript/ts-reset";
import { chalk } from "./deps.ts";
import { DiagnosticsReporter, HELP_TEXT, parseArgs, toErrorMessage } from "./mod.ts";

async function main() {
  const parseArgsDiagnostics = new DiagnosticsReporter();

  const parseResult = parseArgs(Deno.args, parseArgsDiagnostics);

  if (parseArgsDiagnostics.count > 0) {
    console.error(
      chalk.bold.underline(
        `\n${parseArgsDiagnostics.errorsCount} errors, ${parseArgsDiagnostics.warningsCount} warnings\n`,
      ),
    );
  }

  if (parseResult.error) {
    console.log(HELP_TEXT);
    console.error(
      chalk.bold.red(
        "Failed to parse arguments:",
        toErrorMessage(parseResult.error),
      ),
    );
    Deno.exit(1);
  }

  const runDiagnostics = new DiagnosticsReporter();

  const command = parseResult.value;
  const runResult = await command.run(runDiagnostics);

  if (runDiagnostics.count > 0) {
    console.error(
      chalk.bold.underline(
        `\n${runDiagnostics.errorsCount} errors, ${runDiagnostics.warningsCount} warnings\n`,
      ),
    );
  }

  if (runResult.error) {
    console.error(
      chalk.bold.red("Failed to run command:", toErrorMessage(runResult.error)),
    );
    Deno.exit(1);
  }
}

main();
