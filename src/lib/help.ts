import { chalk } from "../deps.ts";

export const HELP_TEXT = `
${chalk.bold.underline("Usage:")}

\trunrc help\t\t${chalk.italic("Show this help text")}
\trunrc init\t\t${chalk.italic("Initialize a new runrc file")}
\trunrc <alias> [args]\t${chalk.italic("Run the command with the given alias")}
`;
