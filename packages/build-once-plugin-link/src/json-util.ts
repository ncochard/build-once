import * as fs from "fs";

export async function loadJson(fileName: string): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data.toString()));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
