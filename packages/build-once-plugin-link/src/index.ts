import { Globs, Plugin, PluginOptions } from "build-once-plugin";
import { getDependencies } from "./get-dependencies";
import { getGlobs } from "./get-globs";
import { getLinks } from "./get-link";

export class LinkPlugin implements Plugin {
  private _options: PluginOptions;
  constructor(options: PluginOptions) {
    if (!options) {
      throw new Error("Plugin options cannot be undefined.");
    }
    this._options = options;
  }
  async getGlobs(): Promise<Globs> {
    const { logger } = this._options;
    const dependencies = await getDependencies(logger);
    const symLinks = await getLinks(dependencies);
    const glogs = getGlobs(symLinks);
    return {
      output: [],
      input: glogs,
    };
  }
}

export function plugin(options: PluginOptions): Plugin {
  if (!options) {
    throw new Error("Plugin options cannot be undefined.");
  }
  return new LinkPlugin(options);
}
