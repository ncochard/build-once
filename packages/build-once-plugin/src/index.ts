export const projectName = "build-once";

export interface Globs {
  input: string[];
  output: string[];
}

export type Feedback = (message: string) => void;

export interface Logger {
  error: Feedback;
  info: Feedback;
  debug: Feedback;
}

export interface PluginOptions {
  logger: Logger;
}

export interface Plugin {
  getGlobs?: () => Promise<Globs>;
}

export type pluginFactory = (options: PluginOptions) => Plugin;
