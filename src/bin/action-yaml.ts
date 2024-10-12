import { existsSync } from "node:fs";
import { mkdir, watch, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { GithubAction } from "@schemastore/github-action";
import { Command } from "commander";
import { parse } from "yaml";
import { actionToType } from "../action-to-type";
import { universalReadFile } from "../utils";

const program = new Command();

program
  .name("generate")
  .description("generate typescript code from action.yaml file")
  .argument("<file>", "output typescript file")
  .option("-i, --input <file>", "input action.yaml file", "action.yaml")
  .option("--watch", "watch mode", false)
  .action(async (file: string, options: { input: string; watch: boolean }) => {
    const inputFile = existsSync(options.input)
      ? options.input
      : existsSync("action.yaml")
        ? "action.yaml"
        : "action.yml";
    const yaml = parse(await universalReadFile(inputFile)) as GithubAction;

    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, actionToType(yaml));

    if (!options.watch) {
      return;
    }

    for await (const _ of watch(inputFile)) {
      const yaml = parse(await universalReadFile(inputFile)) as GithubAction;

      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, actionToType(yaml));
      console.log("Updated", file);
    }
  });

program.parse();
