"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 示例：发送消息到主进程
  sendMessage: (message) => {
    electron.ipcRenderer.send("message", message);
  },
  // 示例：接收来自主进程的消息
  onMessage: (callback) => {
    electron.ipcRenderer.on("message", (_event, message) => callback(message));
  },
  // 在默认浏览器中打开 URL
  openExternal: (url) => {
    electron.ipcRenderer.send("open-external", url);
  },
  // 设置应用程序语言
  setLocale: (locale) => {
    electron.ipcRenderer.send("set-locale", locale);
  }
});
