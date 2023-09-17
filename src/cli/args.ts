import { Result } from "../lib/types.ts";
import { Diagnostic, DiagnosticsReporter } from "./diagnostics.ts";
import {
  HelpCommand,
  InitCommand,
  ISubCommand,
  ListCommand,
  RunCommand,
} from "./sub_command.ts";

export function parseArgs(
  args: string[],
  diagnostics: DiagnosticsReporter,
): Result<ISubCommand, Diagnostic> {
  const command = args[0];

  switch (command) {
    case "help":
      return HelpCommand.parse(args.slice(1), diagnostics);
    case "init":
      return InitCommand.parse(args.slice(1), diagnostics);
    case "list":
      return ListCommand.parse(args.slice(1), diagnostics);
    default:
      return RunCommand.parse(args, diagnostics);
  }
}
