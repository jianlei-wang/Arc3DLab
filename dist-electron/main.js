import { app, ipcMain, shell, Tray, BrowserWindow, session } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;
let tray = null;
function resolveIconPath() {
  return isDev ? path.join(__dirname$1, "../build/icon.ico") : path.join(process.resourcesPath, "icon.ico");
}
function setContentSecurityPolicy() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            isDev ? "connect-src 'self' https: http://localhost:* ws://localhost:*" : "connect-src 'self' https:",
            "worker-src 'self' blob:"
          ].join("; ")
        ]
      }
    });
  });
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: resolveIconPath(),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(() => {
  setContentSecurityPolicy();
  ipcMain.on("open-external", (_event, url) => {
    shell.openExternal(url);
  });
  tray = new Tray(resolveIconPath());
  tray.setToolTip("Arc3DLab");
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
