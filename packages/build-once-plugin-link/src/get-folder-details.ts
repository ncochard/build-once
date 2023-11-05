import * as fs from "fs";
import { FolderDetails } from "./types";

export async function getFolderDetails(
  fileName: string,
): Promise<FolderDetails> {
  return new Promise<FolderDetails>((resolve) => {
    fs.lstat(fileName, function (err, stats) {
      if (err) {
        resolve({ isDirectory: false, isFile: false, isSymlink: false });
      } else {
        resolve({
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          isSymlink: stats.isSymbolicLink(),
        });
      }
    });
  });
}
