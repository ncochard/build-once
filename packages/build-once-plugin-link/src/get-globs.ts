import { projectName } from "build-once-plugin";

export function getGlobs(links: string[]): string[] {
  return links.map((l) => `${l}/.${projectName}/*.*`);
}
