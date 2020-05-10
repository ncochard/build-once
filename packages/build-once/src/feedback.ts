import { bold, dim } from "chalk";
import { projectName } from "build-once-plugin";

const n = bold(`[${projectName}]`);
const f = dim(`(${process.cwd()})`);

export function debug(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
export function error(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
export function info(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
