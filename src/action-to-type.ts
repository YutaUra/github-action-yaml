import type { GithubAction } from "@schemastore/github-action";

export const actionToType = (action: GithubAction) => {
  const actionInputs = action.inputs ?? {};

  const inputsType = `\
export type Inputs<T extends InputOptions<typeof raw> = InputOptions<typeof raw>, V extends InputsValues<typeof raw, T> = InputsValues<typeof raw,T>> = {
${Object.entries(actionInputs ?? {})
  .map(
    ([key, value]) => `\
  /**
   * ${value.description}
   * 
${value.default ? `   * @default ${value.default}\n` : ""}\
${value.deprecationMessage ? `   * @deprecated ${value.deprecationMessage}\n` : ""}\
    */
  '${key}'${value.required || typeof value.default !== "undefined" ? "" : "?"}: V["${key}"];\
`,
  )
  .join("\n")}
}`;

  const outputsType = `\
export type Outputs = {
${Object.entries(
  (action.outputs as Record<string, { description?: string }>) ?? {},
)
  .map(
    ([key, value]) => `\
  /**
   * ${value.description}
   * 
   */
  '${key}'?: string;\
`,
  )
  .join("\n")}
}`;

  const parseInputs = `\
const getInput = {
  string: core.getInput,
  boolean: core.getBooleanInput,
  multiline: core.getMultilineInput,
};

export const parseInputs = <T extends InputOptions<typeof raw>>(options?: T): Prettify<Inputs<T>> => {
  return {
${Object.keys(actionInputs ?? {})
  .map(
    (key) =>
      `    "${key}": getInput[options?.["${key}"]?.type ?? "string"]("${key}", {trimWhitespace: options?.cwd?.trimWhitespace}),`,
  )
  .join("\n")}
  } as Inputs<T>;
}`;

  const dumpOutputs = `\
export const dumpOutputs = (outputs: Partial<Outputs>) => {
  for (const [name, value] of Object.entries(outputs)) {
    core.setOutput(name, value)
  }
}`;

  return `\
// @ts-ignore
import * as core from "@actions/core";
import { Prettify, InputOptions, InputsValues } from "github-action-yaml"

export const raw = ${JSON.stringify(action, null, 2)} as const;

${inputsType}

${outputsType}

${parseInputs}

${dumpOutputs}
`;
};
