
import path from 'path';
import fs, {promises as fsProm} from 'fs';
import { URL } from 'url';

type ResponseStatus = 'success' | 'failure';
export type WriteResult = {
  status: ResponseStatus;
  message: string;
  error: Error;
};

type ReadResult = WriteResult & {
  importedData: App.Config | {}
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

export async function readFromFile(filePath:string):Promise<ReadResult> {
  const readResult:ReadResult = {
    status: 'success',
    message: `Imported properly from ${filePath}`,
    importedData: {},
    error: {} as Error
  };

  try {
    const importedDataRaw = await  fsProm.readFile(filePath, 'utf-8');
    // TODO: add security checks
    readResult.importedData = JSON.parse(importedDataRaw);

  } catch (error) {
    readResult.status = 'failure';
    readResult.message = 'Did not read properly. Check error.';
    readResult.error = error as Error;
  };

  return readResult;
};

export async function importData(filePath:string) {
  const importedData = await readFromFile(filePath);

  return importedData;
};

export async function writeToFile(
  {dataToWrite='', filePath= './', fileNameWithType=`file-${Date.now()}.txt`}
):Promise<WriteResult> {
  const writeResult:WriteResult = {
    status: 'success',
    message: `Saved as ${filePath}/${fileNameWithType}`,
    error: {} as Error
  };

  try {
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });

    await fsProm.writeFile(
      `${filePath}/${fileNameWithType}`,
      dataToWrite
    );

  } catch (error) {
    writeResult.status = 'failure';
    writeResult.message = 'Did not write file. Check error.'
    writeResult.error = error as Error;
  };

  return writeResult;

};

// TODO: modularise this fn or merge this with writeToFile()
export async function exportData({config, fileData}:
  { config:App.Config, fileData:App.IObject<string> }
):Promise<WriteResult> {
  const { filePath, fileName, exportType } = fileData;
  let writeResult:WriteResult = {
    status: 'success',
    message: 'Not saved yet.',
    error: {} as Error
  };

  if (exportType === 'jsonc') {
    const stringifiedData = JSON.stringify(config, null, 2);
    const fileNameWithType = `${fileName}.${exportType}`;

    writeResult = await writeToFile(
      {dataToWrite: stringifiedData, filePath, fileNameWithType}
    );

  };

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

