export type TemplateOptions = {
  args: string[];
};

function resolveArguments(
  template: string,
  args: string[],
) {
  return template.replace(/\{(\-?\d+)\}/g, (_, index) => {
    const value = args.at(Number(index));
    return typeof value === "string" ? JSON.stringify(value) : '""';
  });
}

function resolveArgumentRanges(
  template: string,
  args: string[],
) {
  template = template.replace(/\{(\-?\d+\.\.\-?\d)\}/g, (_, range) => {
    const [start, end] = String(range).split("..").map(Number);
    const values = [];
    for (let i = start; i <= end; i++) {
      const value = args.at(i);
      if (typeof value === "string") {
        values.push(JSON.stringify(value));
      }
    }
    return values.join(" ");
  });

  template = template.replace(/\{(\-?\d+\.\.)\}/g, (_, range) => {
    const start = Number(String(range).replace("..", ""));
    const values = [];
    for (let i = start;; i++) {
      if (start < 0 && i === 0) {
        break;
      }
      const value = args.at(i);
      if (typeof value === "string") {
        values.push(JSON.stringify(value));
      } else {
        break;
      }
    }
    return values.join(" ");
  });

  template = template.replace(/\{(\.\.\-?\d)\}/g, (_, range) => {
    const end = Number(String(range).replace("..", ""));
    const values = [];
    if (end < 0) {
      for (let i = end;; i--) {
        const value = args.at(i);
        if (typeof value === "string") {
          values.unshift(JSON.stringify(value));
        } else {
          break;
        }
      }
    } else {
      for (let i = 0; i <= end; i++) {
        const value = args.at(i);
        if (typeof value === "string") {
          values.push(JSON.stringify(value));
        }
      }
    }
    return values.join(" ");
  });

  template = template.replace(/\{(\.\.)\}/g, () => {
    const values = [];
    for (let i = 0;; i++) {
      const value = args.at(i);
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

function resolveArgumentsCount(template: string, args: string[]) {
  return template.replace(/\{\#\}/g, args.length.toString());
}

export function template(
  options: TemplateOptions,
): (template: string) => string {
  return (template: string) => {
    template = resolveArguments(template, options.args);
    template = resolveArgumentRanges(template, options.args);
    template = resolveArgumentsCount(template, options.args);
    return template;
  };
}
