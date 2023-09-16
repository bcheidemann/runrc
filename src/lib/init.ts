import { Diagnostic, DiagnosticsReporter } from "../cli/diagnostics.ts";
import { chalk, path } from "../deps.ts";
import { Config } from "./config.ts";
import { Err, Ok } from "./result.ts";
import { Result } from "./types.ts";
import { tryAsync } from "./utils.ts";

const HELLO_COMMAND = `NAME=$(echo {1..})
if [[ "$NAME" == "" ]]; then
  echo "No name provided"
  exit 1
fi

echo "Hello $NAME!"`;

const NODE_HELLO_COMMAND = `const NAME = \`{1..}\`.replaceAll("\\"", "");

if (!NAME) {
  console.log("No name provided");
  process.exit(1);
}

console.log(\`Hello \${NAME}!\`);
`;

export async function init(directory: string, diagnostics: DiagnosticsReporter): Promise<Result<void, Diagnostic>> {
  const configPath = path.join(directory, ".runrc");
  const statResult = await tryAsync(() => Deno.stat(configPath));

  if (!statResult.error) {
    const error = Diagnostic.error(".runrc file already exists");
    diagnostics.addAndEmit(error);
    return Err(error);
  }

  const config = new Config({
    commands: [
      {
        alias: "hello",
        name: "Say Hello",
        run: HELLO_COMMAND,
      },
      {
        alias: "node-hello",
        name: "Say Hello (Node)",
        runner: {
          command: "node",
          args: ["-e"],
        },
        run: NODE_HELLO_COMMAND,
      }
    ]
  });
  
  const writeToFileResult = await config.writeToFile(configPath);

  if (writeToFileResult.error) {
    diagnostics.addAndEmit(writeToFileResult.error);
    return Err(writeToFileResult.error);
  }

  diagnostics.addAndEmit(
    Diagnostic.info(`Created .runrc file in ${directory}

\t${chalk.bgHex("#005000").bold(`                                                `)}
\t${chalk.bgHex("#005200").bold(`             ${chalk.bold("RunRC")} is ready to use!             `)}
\t${chalk.bgHex("#005400").bold(`                                                `)}
\t${chalk.bgHex("#005600").gray(`    Run ${chalk.white.bold.italic("runrc list")} to see available commands    `)}
\t${chalk.bgHex("#005900").bold(`                                                `)}`));

  return Promise.resolve(Ok(undefined));
}
