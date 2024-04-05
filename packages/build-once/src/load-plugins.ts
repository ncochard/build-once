import {
  Configuration,
  Logger,
  Plugin,
  pluginFactory,
  PluginInfo,
} from "./types";
import throatFactory from "throat";

const throat = throatFactory(5);

async function loadPlugin(
  pluginName: string,
  logger: Logger,
  debugMode: boolean,
): Promise<PluginInfo> {
    const pluginDepency = `build-once-plugin-${pluginName}`;
    if (debugMode) {
      logger.debug(`Loading ${pluginDepency}.`);
    }
    try {
      const { plugin }: { plugin: pluginFactory } = await import(pluginDepency);
      const result: Plugin = plugin({ logger });
      if (debugMode) {
        logger.debug(`Loaded ${pluginDepency}.`);
      }
      return({
        plugin: result,
        name: pluginDepency,
      });
    } catch (e) {
      logger.error(
        `Could not load plugin "${pluginName}". Try "npm install --dev ${pluginDepency}".`,
      );
      throw(e);
    }
}

export async function loadPlugins(
  config: Configuration,
  logger: Logger,
  debugMode: boolean,
): Promise<PluginInfo[]> {
  return await Promise.all(
    config.use.map(
      (p: string): Promise<PluginInfo> =>
        throat(() => loadPlugin(p, logger, debugMode)),
    ),
  );
}
