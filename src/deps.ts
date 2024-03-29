import * as path from "https://deno.land/std@0.178.0/path/mod.ts";
import _chalk from "npm:chalk@4.1.0";
import YAML from "npm:yaml@2.2.1";
import * as zod from "npm:zod@3.20.5";
import * as zodError from "npm:zod-error@1.5.0";

const chalk = new _chalk.Instance({ level: 3 });

export { chalk, path, YAML, zod, zodError };
