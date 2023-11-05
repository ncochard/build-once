import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Hashes, LoadOptions, SavedData, SaveOptions } from "./types";
import { projectName } from "build-once-plugin";

const folder = `.${projectName}`;

const sanitize = (script: string): string => script.replace(/\W/g, "_");

const file = (script: string): string =>
  path.join(folder, `${sanitize(script)}.json`);

const json = (data: object): string => JSON.stringify(data, null, "  ");

export async function saveHashes(
  { hashes, globs, files }: SavedData,
  { debug, script }: SaveOptions,
): Promise<void> {
  await mkdirp(folder);
  if (debug) {
    fs.writeFileSync(file(script), json({ hashes, globs, files }));
  } else {
    fs.writeFileSync(file(script), json({ hashes }));
  }
}

export function loadHashes({
  script,
}: LoadOptions): Promise<Hashes | undefined> {
  if (!fs.existsSync(folder)) {
    return Promise.resolve(undefined);
  }
  if (!fs.existsSync(file(script))) {
    return Promise.resolve(undefined);
  }
  return new Promise<Hashes>((resolve, reject) => {
    fs.readFile(file(script), (err, data) => {
      if (err) {
        reject(err);
      } else {
        const obj: SavedData = JSON.parse(data.toString()) as SavedData;
        resolve(obj.hashes);
      }
    });
  });
}
