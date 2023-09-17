import { Diagnostic } from "../cli/diagnostics.ts";
import { YAML, zod, zodError } from "../deps.ts";
import { Err, Ok } from "./result.ts";
import { Result } from "./types.ts";
import { tryAsync } from "./utils.ts";

const RUNNER_CONFIG = zod.strictObject({
  command: zod.string(),
  args: zod.array(zod.string()).optional().default([]),
});
const CONFIG_SCHEMA = zod.strictObject({
  runner: RUNNER_CONFIG.optional(),
  commands: zod.array(
    zod.strictObject({
      alias: zod.string(),
      name: zod.string(),
      runner: RUNNER_CONFIG.optional(),
      run: zod.string(),
    }),
  ),
});

export class Config {
  constructor(
    public options: zod.TypeOf<typeof CONFIG_SCHEMA>,
  ) {}

  public static async loadFromFile(
    path: string,
  ): Promise<Result<Config, Diagnostic>> {
    const readResult = await tryAsync(
      () =>
        Deno
          .readTextFile(path)
          .then(YAML.parse),
    );

    if (readResult.error) {
      return readResult;
    }

    const parseResult = CONFIG_SCHEMA.safeParse(readResult.value);

    if (!parseResult.success) {
      return Err(
        Diagnostic.error(
          zodError.generateErrorMessage(parseResult.error.issues, {
            prefix: "Invalid config file: ",
          }),
        ),
      );
    }

    return Ok(new Config(parseResult.data));
  }

  public async writeToFile(path: string): Promise<Result<void, Diagnostic>> {
    const writeResult = await tryAsync(
      () => Deno.writeTextFile(path, YAML.stringify(this.options, null, 2)),
    );

    if (writeResult.error) {
      return Err(writeResult.error);
    }

    return Ok(undefined);
  }
}
