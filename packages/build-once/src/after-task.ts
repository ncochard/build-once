import { CommandOptions, Globs } from "./types";
import { findFilesForConfig } from "./file-system";
import { getHashForConfig } from "./get-hash";
import { saveHashes } from "./hashes-cache";

export async function updateCache(
  { script, debug }: CommandOptions,
  globs: Globs
): Promise<void> {
  const files = findFilesForConfig(globs);
  const hashes = getHashForConfig(await files, { debug });
  await saveHashes(
    { hashes: await hashes, globs, files: await files },
    { debug, script }
  );
}
