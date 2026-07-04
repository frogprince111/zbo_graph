const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zboDesktop", {
  openDownloadsFolder: () => ipcRenderer.invoke("open-downloads-folder"),
});
