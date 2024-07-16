
import path from 'path';
import fs from 'fs';
import fsProm from 'fs/promises';
import { URL } from 'url';

export type WriteResult = {
  status: 'success' | 'failure' | string;
  message: string;
  error: App.IObject<string>;
};

let newHtmlPath;
if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  newHtmlPath = (htmlFileName: string):string => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  newHtmlPath = (htmlFileName: string):string => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
};

export const resolveHtmlPath:(htmlFileName:string) => string = newHtmlPath;

export async function writeToFile(
  {dataToWrite='', filePath= './', fileNameWithType=`file-${Date.now()}.txt`}
):Promise<WriteResult> {
  const result = {
    status: 'success',
    message: `Saved as ${filePath}/${fileNameWithType}`,
    error: {}
  };

  try {
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });

    await fsProm.writeFile(
      `${filePath}/${fileNameWithType}`,
      dataToWrite
    );

  } catch (error:unknown) {
    result.status = 'failure';
    result.message = 'Did not write file. Check error.'
    if (error && typeof (error) === 'object') {
      result.error = error;
    }
  };

  return result;

};

// TODO: modularise this fn or merge this with writeToFile()
export async function exportData({config, fileData}:
  { config:App.Config, fileData:App.IObject<string> }
):Promise<WriteResult> {
  const { filePath, fileName, exportType } = fileData;
  console.log(`filePath: `, filePath);
  let writeResult = {
    status: 'success',
    message: 'Not saved yet.',
    error: {}
  };

  if (exportType === 'jsonc') {
    const stringifiedData = JSON.stringify(config, null, 2);

    // console.log(`stringifiedData: `, stringifiedData);

    const fileNameWithType = `${fileName}.${exportType}`;
    writeResult = await writeToFile(
      {dataToWrite: stringifiedData, filePath, fileNameWithType}
    );
    console.log(`writeResult: `, writeResult);

  }

  return writeResult;

};

// renamed fn name from parseIfObject from src\renderer\utils\misc.ts
type SafeParseReturn = App.IObject<string>|string|boolean;
export function safeParse(
  str:string|undefined, fallback:SafeParseReturn='{}'
):SafeParseReturn {
  if (typeof(str) === 'undefined') return fallback;
  if (
      typeof(str) === 'string'
      && str[0] === '{'
      && str[str.length-1] === '}'
  ) {
    return JSON.parse(str)
  };
  return str;
};

