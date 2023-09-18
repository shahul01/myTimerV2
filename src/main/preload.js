
const { contextBridge, ipcRenderer } = require('electron');
/**
  *
  *  setup → communication
  *    1. setup
  *      electron-preload → renderer
  *    2. communication
  *      → electron-main(event reply via 'once') → renderer
  *
*/

// TODO: export this to constant file
const envVar = {
  IS_DEVELOPMENT_USER: process.env.IS_DEVELOPMENT_USER,
  SERVE_MODE: process.env.SERVE_MODE,
  URL: process.env.URL,
  USER: process.env.USER
};

// TODO: change to typescript
contextBridge.exposeInMainWorld('electron', {

  ipcRenderer: {
    myPing(arg='ping') {
      ipcRenderer.send('ipc-example', arg);
    },

    envVar,

    // hover and resize
    handleStickyHover(arg) {
      ipcRenderer.send('handle-sticky-hover', arg);
    },

    // timer end
    handleTimerEnd(arg) {
      ipcRenderer.send('handle-timer-end', arg);
    },

    handleExport(arg) {
      ipcRenderer.send('handle-export', arg);
    },

    // electron to react
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
