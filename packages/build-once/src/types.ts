import { Globs, Plugin } from "build-once-plugin";

export {
  Globs,
  Feedback,
  Logger,
  PluginOptions,
  Plugin,
  pluginFactory,
} from "build-once-plugin";

export enum Commands {
  npm = "npm",
  yarn = "yarn",
}

export interface CommandResult {
  success: boolean;
  exitCode?: number;
}

export interface Configuration extends Globs {
  command: Commands;
  use: string[];
}

export interface Hashes {
  input: string;
  output: string;
}

export interface Files {
  input: string[];
  output: string[];
}

export interface SavedData {
  hashes: Hashes;
  globs?: Globs;
  files?: Files;
}

export interface SaveOptions {
  debug: boolean;
  script: string;
}

export interface LoadOptions {
  script: string;
}

export interface DebugOptions {
  debug: boolean;
}

export type CommandOptions = LoadOptions & DebugOptions;

export interface PluginInfo {
  plugin: Plugin;
  name: string;
}
