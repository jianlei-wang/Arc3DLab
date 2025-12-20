import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // 示例：发送消息到主进程
  sendMessage: (message) => {
    ipcRenderer.send("message", message);
  },
  // 示例：接收来自主进程的消息
  onMessage: (callback) => {
    ipcRenderer.on("message", (_event, message) => callback(message));
  },
  // 在默认浏览器中打开 URL
  openExternal: (url) => {
    ipcRenderer.send("open-external", url);
  },
  // 设置应用程序语言
  setLocale: (locale) => {
    ipcRenderer.send("set-locale", locale);
  }
});
derer.send("set-locale", locale);
  }
});
