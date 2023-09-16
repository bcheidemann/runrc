import { chalk } from "../deps.ts";

export type DiagnosticLevel = "error" | "warning" | "info" | "debug";

export interface IDiagnostic {
  readonly level: DiagnosticLevel;
  toString(): string;
  emit(): void;
}

export class Diagnostic implements IDiagnostic {
  constructor(
    public readonly level: DiagnosticLevel,
    public readonly message: string,
  ) {}

  public static error(message: string) {
    return new Diagnostic("error", message);
  }

  public static warning(message: string) {
    return new Diagnostic("warning", message);
  }

  public static info(message: string) {
    return new Diagnostic("info", message);
  }

  public static debug(message: string) {
    return new Diagnostic("debug", message);
  }

  public toString() {
    switch (this.level) {
      case "error":
        return `${chalk.bold.red(" ERROR")}\t${this.message}`;
      case "warning":
        return `${chalk.bold.yellow(" WARNING")}\t${this.message}`;
      case "info":
        return `${chalk.bold.blue(" INFO")}\t${this.message}`;
      case "debug":
        return `${chalk.bold.gray(" DEBUG")}\t${this.message}`;
      default:
        throw new Error(`Unknown diagnostic level: ${this.level}`);
    }
  }

  public emit() {
    console.error(this.toString());
  }
}

export class DiagnosticsReporter {
  public diagnostics: IDiagnostic[] = [];

  constructor(
    private readonly level: DiagnosticLevel = "info",
  ) {}

  public addAndEmit(diagnostic: IDiagnostic) {
    if (canEmit(diagnostic.level, this.level)) {
      console.log();
      diagnostic.emit();
    }
    this.add(diagnostic);
  }

  public add(diagnostic: IDiagnostic) {
    this.diagnostics.push(diagnostic);
  }

  public emit() {
    for (const diagnostic of this.diagnostics) {
      if (canEmit(diagnostic.level, this.level)) {
        diagnostic.emit();
      }
    }
  }

  public get count() {
    return this.diagnostics.length;
  }

  public get errorsCount() {
    return this.diagnostics.filter((d) => d.level === "error").length;
  }

  public get warningsCount() {
    return this.diagnostics.filter((d) => d.level === "warning").length;
  }

  public get hasErrors() {
    return this.diagnostics.some((d) => d.level === "error");
  }
}

function canEmit(
  level: DiagnosticLevel,
  reporterLevel: DiagnosticLevel,
) {
  switch (reporterLevel) {
    case "error":
      return level === "error";
    case "warning":
      return level === "error" || level === "warning";
    case "info":
      return level === "error" || level === "warning" || level === "info";
    case "debug":
      return true;
    default:
      throw new Error(`Unknown diagnostic level: ${level}`);
  }
}
