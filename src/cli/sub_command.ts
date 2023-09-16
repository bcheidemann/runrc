import { HELP_TEXT } from "../lib/help.ts";
import { init } from "../lib/init.ts";
import { list } from "../lib/list.ts";
import { Err, Ok } from "../lib/result.ts";
import { run } from "../lib/run.ts";
import { Result } from "../lib/types.ts";
import { Diagnostic, DiagnosticsReporter } from "./diagnostics.ts";

export interface ISubCommand {
  run(diagnostics: DiagnosticsReporter): Promise<Result<void, Diagnostic>>;
}

export class HelpCommand implements ISubCommand {
  public static parse(args: string[], diagnostiscs: DiagnosticsReporter): Result<HelpCommand, Diagnostic> {
    if (args.length > 0) {
      diagnostiscs.addAndEmit(
        Diagnostic.warning("help command does not take any arguments"),
      );
    }

    return Ok(new HelpCommand());
  }

  public run(_diagnostics: DiagnosticsReporter): Promise<Result<void, Diagnostic>> {
    console.log(HELP_TEXT);

    return Promise.resolve(Ok(undefined));
  }
}

export class InitCommand implements ISubCommand {
  public static parse(args: string[], diagnostiscs: DiagnosticsReporter): Result<InitCommand, Diagnostic> {
    if (args.length > 0) {
      diagnostiscs.addAndEmit(
        Diagnostic.warning("init command does not take any arguments"),
      );
    }

    return Ok(new InitCommand());
  }

  public run(diagnostics: DiagnosticsReporter): Promise<Result<void, Diagnostic>> {
    return init(Deno.cwd(), diagnostics);
  }
}

export class ListCommand implements ISubCommand {
  public static parse(args: string[], diagnostiscs: DiagnosticsReporter): Result<ListCommand, Diagnostic> {
    if (args.length > 0) {
      diagnostiscs.addAndEmit(
        Diagnostic.warning("list command does not take any arguments"),
      );
    }

    return Ok(new ListCommand());
  }

  public run(diagnostics: DiagnosticsReporter): Promise<Result<void, Diagnostic>> {
    return list(diagnostics);
  }
}


export class RunCommand implements ISubCommand {
  constructor(
    public readonly alias: string,
    public readonly args: string[],
  ) {}

  public static parse(args: string[], diagnostiscs: DiagnosticsReporter): Result<RunCommand, Diagnostic> {
    if (args.length < 1) {
      const error = Diagnostic.error("at least one argument is required");
      diagnostiscs.addAndEmit(error);
      return Err(error);
    }

    return Ok(new RunCommand(
      args[0],
      args.slice(1),
    ));
  }

  public run(diagnostics: DiagnosticsReporter): Promise<Result<void, Diagnostic>> {
    return run(this.alias, this.args, diagnostics);
  }
}
