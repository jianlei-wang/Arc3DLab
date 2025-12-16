import { app, ipcMain, shell, Tray, BrowserWindow, session } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;
let splashScreen = null;
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
function getAppLocale() {
  try {
    const configPath = path.join(app.getPath("userData"), "app-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.locale) {
        return config.locale;
      }
    }
  } catch (error) {
    console.error("Error reading app config:", error);
  }
  return app.getLocale();
}
function saveAppLocale(locale) {
  try {
    const configPath = path.join(app.getPath("userData"), "app-config.json");
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    config = { ...config, locale };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving app config:", error);
  }
}
function createSplashScreen() {
  splashScreen = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: false,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    icon: resolveIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const appLocale = getAppLocale();
  let splashFile = "splash-en.html";
  if (appLocale.startsWith("zh")) {
    splashFile = "splash-zh.html";
  }
  let splashPath;
  if (isDev) {
    splashPath = path.join(__dirname$1, `../${splashFile}`);
  } else {
    splashPath = path.join(process.resourcesPath, splashFile);
  }
  const splashUrl = `file://${splashPath.replace(/\\/g, "/")}`;
  splashScreen.loadURL(splashUrl);
  splashScreen.show();
  splashScreen.on("closed", () => {
    splashScreen = null;
  });
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: resolveIconPath(),
    show: false,
    // Initially hide the main window
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
  }
  mainWindow.webContents.once("dom-ready", () => {
    mainWindow?.webContents.send("main-window-loaded");
  });
  ipcMain.on("set-locale", (_event, locale) => {
    saveAppLocale(locale);
  });
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
  createSplashScreen();
  createWindow();
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.close();
    }
    if (mainWindow) {
      mainWindow.show();
    }
  }, 3e3);
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
