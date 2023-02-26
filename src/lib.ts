
import { chalk, path, YAML, zod } from "./deps.ts";

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
    })
  ),
});

export class RunConfig {
  private config?: zod.infer<typeof RunConfigSchema>;

  public async load() {
    const text = await Deno.readTextFile(Config.runrc);
    const data = YAML.parse(text);

    this.config = RunConfigSchema.parse(data);
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
      console.log(chalk.bold.bgRed(` No command found for alias ${alias} `));
      return 1;
    }

    // find all instances of __0, __1, etc and replace with the arguments
    let run = command.run;
    const args = Deno.args.slice(1);
    for (let i = 0; i < args.length; i++) {
      run = run.replace(`__${i}`, Deno.args[i]);
    }

    // replace all instances of __@ with the arguments
    run = run.replace(/__@/g, args.join(" "));

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
            [command.runner.command, ...command.runner.args].join(" ")
          )
      );
      if (Deno.args.includes("--verbose") || Deno.args.includes("-v")) {
        console.log(chalk.bold("Run: "));
        console.log(chalk.italic(command.run));
      }
      console.log("");
    }
  }
}

export function error(message: string) {
  console.log(chalk.bold.bgRed(" ERROR ") + chalk.bold.red(` ${message} `));
}
