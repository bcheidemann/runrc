export type ResolveArgumentFn = (index: number) => string | undefined | null;

export type TemplateOptions = {
  resolveArgument: ResolveArgumentFn;
};

function resolveArguments(
  template: string,
  resolveArgument: ResolveArgumentFn,
) {
  return template.replace(/\{(\d+)\}/g, (_, index) => {
    const value = resolveArgument(Number(index));
    return typeof value === "string" ? JSON.stringify(value) : '""';
  });
}

function resolveArgumentRanges(
  template: string,
  resolveArgument: ResolveArgumentFn,
) {
  template = template.replace(/\{(\d+\.\.\d)\}/g, (_, range) => {
    const [start, end] = String(range).split("..").map(Number);
    const values = [];
    for (let i = start; i <= end; i++) {
      const value = resolveArgument(i);
      if (typeof value === "string") {
        values.push(JSON.stringify(value));
      }
    }
    return values.join(" ");
  });

  template = template.replace(/\{(\d+\.\.)\}/g, (_, range) => {
    const start = Number(String(range).replace("..", ""));
    const values = [];
    for (let i = start;; i++) {
      const value = resolveArgument(i);
      if (typeof value === "string") {
        values.push(JSON.stringify(value));
      } else {
        break;
      }
    }
    return values.join(" ");
  });

  template = template.replace(/\{(\.\.\d)\}/g, (_, range) => {
    const end = Number(String(range).replace("..", ""));
    const values = [];
    for (let i = 0; i <= end; i++) {
      const value = resolveArgument(i);
      if (typeof value === "string") {
        values.push(JSON.stringify(value));
      }
    }
    return values.join(" ");
  });

  template = template.replace(/\{(\.\.)\}/g, () => {
    const values = [];
    for (let i = 0;; i++) {
      const value = resolveArgument(i);
      if (typeof value === "string") {
        values.push(JSON.stringify(value));
      } else {
        break;
      }
    }
    return values.join(" ");
  });

  return template;
}
export function template(
  options: TemplateOptions,
): (template: string) => string {
  return (template: string) => {
    template = resolveArguments(template, options.resolveArgument);
    template = resolveArgumentRanges(template, options.resolveArgument);
    return template;
  };
}
