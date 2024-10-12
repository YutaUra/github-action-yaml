import { readFile } from "node:fs/promises";

function isUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const universalReadFile = async (path: string) => {
  if (isUrl(path)) {
    const response = await fetch(path);
    return response.text();
  }
  const file = await readFile(path, "utf-8");
  return file;
};
