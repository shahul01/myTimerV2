const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {

    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },

    // hover and resize
    handleStickyHover(arg) {
      ipcRenderer.send('handle-sticky-hover', arg);
    },

    // timer end
    handleTimerEnd(arg) {
      ipcRenderer.send('handle-timer-end', arg);
    },


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
