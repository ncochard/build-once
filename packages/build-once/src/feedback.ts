import { bold, dim } from "chalk";
import { projectName } from "build-once-plugin";

const n = bold(`[${projectName}]`);
const f = dim(`(${process.cwd()})`);

export function debug(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
export function error(message: any): void {
  if (typeof message === "string") {
    process.stdout.write(`${n} ${message} ${f}\n`);
  } else {
    process.stdout.write(message);
  }
}
export function info(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
