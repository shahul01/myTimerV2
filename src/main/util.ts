import path from 'path';
import fs, {promises as fsProm} from 'fs';
import { exec } from 'child_process';
import { URL } from 'url';
import { dialog } from 'electron';
// import { dialogMessage } from './main';

export type WriteResult = {
  status: 'success' | 'failure';
  message: string;
  error: Error;
};
type ReadResult = WriteResult & {
  importedData: App.Config
};

type SafeParseReturn = App.IObject<string>|string|boolean;


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

export async function sleep(ms:number) {
  // eslint-disable-next-line compat/compat
  await new Promise(resolve => {setTimeout(resolve, ms)});
};

export function dialogMessage(mainWindow:Electron.BrowserWindow, myMessage: string) {
  return dialog.showMessageBox(mainWindow!, {
    title: 'Message',
    message: myMessage,
  });
};

let currServerRelaunchCount = 0;
const maxServerRelaunchCount  = 4;

export async function launchServer(
  mainWindow:Electron.BrowserWindow, myMessage:string
) {
  let isServerLaunched = false;
  if (currServerRelaunchCount > maxServerRelaunchCount) {
    dialogMessage(mainWindow!, 'All server launches failed. Do install properly and check the server build path environment variable.');
    return isServerLaunched;
  };
  const serverBuildPath = process.env.SERVER_BUILD_PATH;

  exec(`node ${serverBuildPath}`, async (error, stdout, stderr) => {
    if (stderr !== '') console.error('Launch server stderr: ', stderr);
    if (error || stderr !== '') {
      await sleep(250);
      currServerRelaunchCount += 1;
      dialogMessage(mainWindow, myMessage);
      console.error(`Server launch failed. Relaunching Server - ${currServerRelaunchCount}/${maxServerRelaunchCount}`);
      launchServer(mainWindow, `Server launch failed. Relaunching Server - ${currServerRelaunchCount}/${maxServerRelaunchCount}`);
      return;
    };
    if (!error && stderr === '') {
      isServerLaunched = true;
      dialogMessage(mainWindow, myMessage);
    };
    console.log('stdout', stdout);
  });

  return isServerLaunched;
};

export async function readFromFile(filePath:string):Promise<ReadResult> {
  const readResult:ReadResult = {
    status: 'success',
    message: `Imported properly from ${filePath}`,
    importedData: {} as App.Config,
    error: {} as Error
  };

  try {
    const importedDataRaw = await  fsProm.readFile(filePath, 'utf-8');
    // TODO: add security checks
    // TODO: zod Config schema parse check
    readResult.importedData = JSON.parse(importedDataRaw);

  } catch (error) {
    readResult.status = 'failure';
    readResult.message = 'Did not read properly. Check error.';
    readResult.error = error as Error;
  };

  return readResult;
};

export async function importData(filePath:string) {
  return readFromFile(filePath);
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

// TODO: modularize this fn or merge this with writeToFile()
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

export function killProcessByPort(serverPort:Number) {
  console.log('killProcessByPort() called');
  const findProcessCommand = `netstat -ano | findstr ":${serverPort}"`;
  const killCommand = `taskkill -F /PID`;

  exec(findProcessCommand, (error, stdout, stderr) => {
    if (error) return console.error('error', error);
    const lines = stdout.split("\r\n");
    console.log(`lines: `, lines);
    const pidLine = lines[0];
    if (!pidLine) return console.log(`No process found listening on port ${serverPort}.`);

    const pid = pidLine.trim().split(/\s+/);
    exec(`${killCommand} ${pid}`, (errKill, stdoutKill, stderrKill) => {
      if (errKill) return console.error(errKill);
      console.log(`Port ${serverPort} is now free.`);

      return '';
    });

    return '';

  });

};
