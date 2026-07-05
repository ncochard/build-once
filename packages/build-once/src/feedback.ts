import { projectName } from "build-once-plugin";

const n = `\x1b[1m[${projectName}]\x1b[22m`;
const f = `\x1b[2m(${process.cwd()})\x1b[22m`;

export function debug(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
export function error(message: unknown): void {
  if (typeof message === "string") {
    process.stdout.write(`${n} ${message} ${f}\n`);
  } else {
    console.error(message);
  }
}
export function info(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
