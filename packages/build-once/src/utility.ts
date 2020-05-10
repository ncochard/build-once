import { Hashes } from "./types";

export function same(
  value1: Hashes | undefined,
  value2: Hashes | undefined
): boolean {
  if (value1) {
    return (
      !!value2 &&
      value1.input === value2.input &&
      value1.output === value2.output
    );
  } else {
    return !value2;
  }
}
