import { app as o, Tray as d, BrowserWindow as r, session as u } from "electron";
import n from "node:path";
import { fileURLToPath as p } from "node:url";
const h = p(import.meta.url), s = n.dirname(h);
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
const t = process.env.NODE_ENV === "development";
let e = null, l = null;
function a() {
  return t ? n.join(s, "../build/icon.ico") : n.join(process.resourcesPath, "icon.ico");
}
function w() {
  u.defaultSession.webRequest.onHeadersReceived((c, f) => {
    f({
      responseHeaders: {
        ...c.responseHeaders,
        "Content-Security-Policy": [
          t ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; worker-src 'self' blob:"
        ]
      }
    });
  });
}
function i() {
  e = new r({
    width: 1200,
    height: 800,
    autoHideMenuBar: !0,
    icon: a(),
    webPreferences: {
      preload: n.join(s, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), t ? (e.loadURL("http://localhost:5173"), e.webContents.openDevTools()) : (e.loadFile(n.join(s, "../dist/index.html")), e.webContents.openDevTools()), e.on("closed", () => {
    e = null;
  });
}
o.whenReady().then(() => {
  w(), l = new d(a()), l.setToolTip("Arc3DLab"), i(), o.on("activate", () => {
    r.getAllWindows().length === 0 && i();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
