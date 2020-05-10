import * as globby from "globby";
import { Files, Globs } from "./types";

async function findFiles(filePatters: string[]): Promise<string[]> {
  return (await globby(filePatters)).sort();
}

export async function findFilesForConfig(globs: Globs): Promise<Files> {
  const input = findFiles(globs.input);
  const output = findFiles(globs.output);
  return {
    input: await input,
    output: await output,
  };
}
