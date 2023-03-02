import { chalk, path, Result, YAML, zod, zodError } from "./deps.ts";
import { resultFromSync } from "./result-utils.ts";
import { template } from "./template.ts";

class Config {
  public static runrc = path.join(Deno.cwd(), ".runrc");
}

const RunnerSchema = zod.strictObject({
  command: zod.string(),
  args: zod.array(zod.string()).optional().default([]),
});

const RunConfigSchema = zod.strictObject({
  // TODO: add support for importing other runrc files
  // imports: zod.array(zod.string()).optional(),
  runner: RunnerSchema.optional(),
  commands: zod.array(
    zod.strictObject({
      alias: zod.string(),
      name: zod.string(),
      runner: RunnerSchema.optional(),
      run: zod.string(),
    }),
  ),
});

export class RunConfig {
  private config?: zod.infer<typeof RunConfigSchema>;

  public async load(): Promise<Result<null, Error>> {
    const text = await Deno.readTextFile(Config.runrc);
    const data = resultFromSync<unknown, Error>(() => YAML.parse(text));

    if (data.isErr) {
      data.error.message = eformat(
        `Error parsing ${Config.runrc}: ${data.error.message}`,
      );
      return Result.err(data.error);
    }

    const parsedSchema = RunConfigSchema.safeParse(data.value);

    if (!parsedSchema.success) {
      const err = zodError.generateErrorMessage(
        parsedSchema.error.issues,
        {
          delimiter: {
            error: "\n",
          },
          path: {
            enabled: true,
            label: null,
            type: "objectNotation",
          },
          message: {
            enabled: true,
            label: null,
          },
          transform({ messageComponent, pathComponent }) {
            return eformat(
              `Error parsing ${Config.runrc} at ${
                pathComponent === "" ? "<root>" : pathComponent
              }: ${messageComponent}`,
            );
          },
        },
      );

      return Result.err(new Error(err));
    }

    this.config = parsedSchema.data;

    return Result.ok(null);
  }

  public getConfig() {
    if (!this.config) {
      throw new Error("RunConfig not loaded");
    }
    return this.config;
  }

  private getCommandConfig(alias: string) {
    const config = this.getConfig();
    const command = config.commands.find((command) => command.alias === alias);
    if (!command) {
      return null;
    }
    const commandWithRunner = structuredClone(command);
    if (!commandWithRunner.runner) {
      commandWithRunner.runner = config.runner || {
        command: "zsh",
        args: ["-c"],
      };
    }

    return commandWithRunner;
  }

  public async runCommand(alias: string) {
    const command = this.getCommandConfig(alias);
    if (!command) {
      eprintln(`No command found for alias ${alias} `);
      return 1;
    }

    // apply the template
    const run = template({
      args: Deno.args,
    })(command.run);

    // run the command
    const process = Deno.run({
      cmd: [command.runner.command, ...command.runner.args, run],
    });

    const status = await process.status();

    return status.code;
  }

  public listCommands() {
    const config = this.getConfig();
    const commands = config.commands.map(({ alias }) =>
      this.getCommandConfig(alias)
    );
    console.log(chalk.bold.bgBlue(" COMMANDS "));
    for (const command of commands) {
      console.log(chalk.bold("Name: ") + chalk.italic(command.name));
      console.log(chalk.bold("Alias: ") + chalk.italic(command.alias));
      console.log(
        chalk.bold("Runner: ") +
          chalk.italic(
            [command.runner.command, ...command.runner.args].join(" "),
          ),
      );
      if (Deno.args.includes("--verbose") || Deno.args.includes("-v")) {
        console.log(chalk.bold("Run: "));
        console.log(chalk.italic(command.run));
      }
      console.log("");
    }
  }
}

export function eformat(message: string) {
  return chalk.bold.bgRed(" ERROR ") + chalk.bold.red(` ${message} `);
}

export function eprintln(message: string) {
  console.error(eformat(message));
}
