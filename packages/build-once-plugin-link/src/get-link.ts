import { join, relative } from "path";
import { createRequire } from "module";
import { getFolderDetails } from "./get-folder-details";
import throatFactory from "throat";

const MAX_NUMBER_OF_FILES_CONCURENTLY_OPENED = 50;
const throat = throatFactory(MAX_NUMBER_OF_FILES_CONCURENTLY_OPENED);

async function getLink(dependencyName: string): Promise<string | undefined> {
  if (!dependencyName) {
    return undefined;
  }
  const req = createRequire(join(process.cwd(), "index.js"));
  const folders: string[] = req.resolve.paths(dependencyName) || [];
  const fullPaths: string[] = folders.map((f: string): string =>
    join(f, dependencyName)
  );
  //console.log(fullPaths);
  for (const fullPath of fullPaths) {
    if ((await getFolderDetails(fullPath)).isSymlink) {
      return fullPath;
    }
  }
}

function makeRelative(folder: string): string {
  return relative(process.cwd(), folder).replace(/\\/g, "/");
}

export async function getLinks(dependencyNames: string[]): Promise<string[]> {
  const potentialLinks: (string | undefined)[] = await Promise.all(
    dependencyNames.map(
      (dependencyName: string): Promise<string | undefined> =>
        throat(() => getLink(dependencyName))
    )
  );
  const links = potentialLinks.filter((r) => !!r) as string[];
  return links.map(makeRelative);
}
