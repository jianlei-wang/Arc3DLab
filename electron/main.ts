import { app, BrowserWindow, session, Tray, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// 当前环境判断
const isDev = process.env.NODE_ENV === 'development';

// 主窗口和启动屏幕
let mainWindow: BrowserWindow | null = null;
let splashScreen: BrowserWindow | null = null;
let tray: Tray | null = null;

function resolveIconPath() {
  return isDev
    ? path.join(__dirname, '../build/icon.ico')
    : path.join(process.resourcesPath, 'icon.ico');
}

// 设置内容安全策略（CSP）
function setContentSecurityPolicy() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            isDev
              ? "connect-src 'self' https: http://localhost:* ws://localhost:*"
              : "connect-src 'self' https:",
            "worker-src 'self' blob:"
          ].join('; ')
        ],
      },
    });
  });
}

function createSplashScreen(systemLocale: string) {
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
      contextIsolation: true,
    },
  });

  // Select splash screen based on system locale
  let splashFile = 'splash-en.html';
  if (systemLocale.startsWith('zh')) {
    splashFile = 'splash-zh.html';
  }
  
  const splashPath = path.join(__dirname, `../${splashFile}`).replace(/\\/g, '/');
  const splashUrl = `file:///${splashPath}`;
  splashScreen.loadURL(splashUrl);
  
  // Show splash screen immediately
  splashScreen.show();

  splashScreen.on('closed', () => {
    splashScreen = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: resolveIconPath(),
    show: false, // Initially hide the main window
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 开发环境加载 Vite 开发服务器
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    // 生产环境加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    // mainWindow.webContents.openDevTools();
  }

  // 当主窗口加载完成时，通知主进程
  mainWindow.webContents.once('dom-ready', () => {
    // 发送消息给渲染进程，表示主窗口已准备就绪
    mainWindow?.webContents.send('main-window-loaded');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备就绪
app.whenReady().then(() => {
  // 设置 CSP 安全策略
  setContentSecurityPolicy();

  // 注册 IPC 处理器：打开外部链接
  ipcMain.on('open-external', (_event, url: string) => {
    shell.openExternal(url)
  })

  tray = new Tray(resolveIconPath());
  tray.setToolTip('Arc3DLab');

  // Get system locale and create splash screen
  const systemLocale = app.getLocale();
  createSplashScreen(systemLocale);
  
  // 创建主窗口
  createWindow();
  
  // 3秒后关闭启动屏幕并显示主窗口
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.close();
    }
    if (mainWindow) {
      mainWindow.show();
    }
  }, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
