import type { GithubAction as RawGitHubAction } from "@schemastore/github-action";

export type GithubAction = Omit<RawGitHubAction, "runs">;

export type Prettify<Type> = {
  [Key in keyof Type]: Type[Key];
} & {};

type InputsKeys<T extends GithubAction> = keyof T["inputs"];

type InputOption = {
  type?: "boolean" | "multiline" | "string";
  trimWhitespace?: boolean;
};

export type InputOptions<T extends GithubAction> = Partial<
  Record<InputsKeys<T>, InputOption>
>;
export type InputsValues<
  Action extends GithubAction,
  Option extends InputOptions<Action> = InputOptions<Action>,
> = {
  [K in InputsKeys<Action>]: Option[K] extends { type: infer V }
    ? V extends "boolean"
      ? boolean
      : V extends "multiline"
        ? string[]
        : string
    : string;
};
