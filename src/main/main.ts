/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

process.env.isDevelopmentUser='false';
const isDevelopmentUser:boolean = JSON.parse(
  (process.env.isDevelopmentUser || 'false')
);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

function appDimensionDict() {
  console.log(`isDevelopmentUser: `, isDevelopmentUser);
  return isDevelopmentUser ? (
    {
      hideTimers: { height: 400, width: 600 },
      showTimers: { height: 400, width: 600 },
      expanded: { height: 400, width: 600 }

    }
  ) : (
    {
      hideTimers: { height: 48, width: 140 },
      showTimers: { height: 370, width: 140 },
      expanded: { height: 400, width: 600 }
    }
  )
};

const userSettings = {
  version: '1.0.0',
  appDimension: {
    sticky: appDimensionDict(),
  }

};

function getAppDimension(dimension:'height'|'width', isStickyHovered:boolean):number{
  const displayOption = isStickyHovered ? 'showTimers' : 'hideTimers';
  const newSize = userSettings.appDimension.sticky[displayOption][dimension];
  // console.log(`newSize ${dimension}: `, newSize);
  return newSize;
};

// ipc

// TODO: make these event name a constant
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on(
  'handle-sticky-hover',
  (e, arg:boolean) => {
    // console.log(`arg: `, arg);
    const newHeight = getAppDimension('height', arg);
    const newWidth = getAppDimension('width', arg);
    mainWindow?.setSize(newWidth, newHeight);
  }
);
ipcMain.on(
  'handle-timer-end',
  (e, arg) => {

    // TODO: modularise this function
    if (!mainWindow) return ;
    dialog.showMessageBox(
      mainWindow,
      {
        title: 'myTimer',
        message: `Timer for Task ${arg.taskTitle} is done`
      }
    );

  }
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment && isDevelopmentUser) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};


const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: getAppDimension('width', false),
    height: getAppDimension('height', false),
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },

    frame: false,
    resizable: true,

    // fix: enabling 'transparent' disables window maximization
    transparent: true,
  });

  mainWindow.setVisibleOnAllWorkspaces(true, {});
  mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  // mainWindow.moveTop();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {

      mainWindow.show();

    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
