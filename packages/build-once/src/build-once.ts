import { debug, error, info } from "./feedback";
import { getHashForConfig, hashAlgorithm } from "./get-hash";
import { executeCommand } from "./execute-task";
import { findFilesForConfig } from "./file-system";
import { getCommand } from "./command";
import { getConfiguration } from "./configuration";
import { getGlobs } from "./get-globs";
import { loadHashes } from "./hashes-cache";
import { loadPlugins } from "./load-plugins";
import { Logger } from "./types";
import { same } from "./utility";
import { updateCache } from "./after-task";

async function main(): Promise<void> {
  const { script, debug: debugMode } = await getCommand();
  const logger: Logger = { error, info, debug };
  const config = await getConfiguration(script);
  const plugins = await loadPlugins(config, logger, debugMode);
  const globs = await getGlobs(config, plugins, logger, debugMode);
  const files = findFilesForConfig(globs);
  const newHashes = await getHashForConfig(await files, { debug: debugMode });
  const lastHashes = await loadHashes({ script });
  const cmd = `${config.command} run ${script}`;
  if (same(newHashes, lastHashes)) {
    info(
      `The stored ${hashAlgorithm} indicates that "${cmd}" doesn't need to be executed.`,
    );
  } else {
    const { success, exitCode } = await executeCommand(config, {
      script,
      debug: debugMode,
    });
    if (success) {
      await updateCache({ script, debug: debugMode }, globs);
    } else {
      process.exit(exitCode || 1);
    }
  }
}

(async (): Promise<void> => {
  try {
    await main();
  } catch (e) {
    error("Something went wrong!");
    error(e);
    process.exit(1);
  }
})();
