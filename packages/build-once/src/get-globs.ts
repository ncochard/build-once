import { Globs, Logger, PluginInfo } from "./types";

function mergeGlobs(globs1: Globs, globs2: Globs): Globs {
  return {
    input: [...globs1.input, ...globs2.input],
    output: [...globs1.output, ...globs2.output],
  };
}

type getGlobs = () => Promise<Globs>;

function defaultGetGlobs(): Promise<Globs> {
  return Promise.resolve({
    input: [],
    output: [],
  });
}

export async function getGlobs(
  config: Globs,
  pluginInfos: PluginInfo[],
  logger: Logger,
  debugMode: boolean,
): Promise<Globs> {
  const globsListPromise: Promise<Globs>[] = pluginInfos.map(
    async (p: PluginInfo) => {
      try {
        const getGlobsFct = p.plugin.getGlobs || defaultGetGlobs;
        return await getGlobsFct.call(p.plugin);
      } catch (e) {
        if (debugMode) {
          logger.debug(`Failed to load the globs from "${p.name}".`);
        }
        throw e;
      }
    },
  );
  const globsList: Globs[] = await Promise.all(globsListPromise);
  return globsList.reduce(mergeGlobs, config);
}
