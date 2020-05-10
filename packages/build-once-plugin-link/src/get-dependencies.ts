import { loadJson } from "./json-util";
import { Logger } from "build-once-plugin";

interface Package {
  dependencies: object;
  devDependencies: object;
}

export async function getDependencies(logger: Logger): Promise<string[]> {
  try {
    const pkg = (await loadJson("./package.json")) as Package;
    const dependencies = pkg.dependencies || {};
    const devDependencies = pkg.devDependencies || {};
    return [...Object.keys(dependencies), ...Object.keys(devDependencies)];
  } catch (e) {
    logger.error("Failed to read the package.json");
    throw e;
  }
}
