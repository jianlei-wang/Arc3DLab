import { app as n, BrowserWindow as l, session as c } from "electron";
import s from "node:path";
import { fileURLToPath as f } from "node:url";
const d = f(import.meta.url), o = s.dirname(d);
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
const i = process.env.NODE_ENV === "development";
let e = null;
function p() {
  c.defaultSession.webRequest.onHeadersReceived((a, r) => {
    r({
      responseHeaders: {
        ...a.responseHeaders,
        "Content-Security-Policy": [
          i ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" : "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
        ]
      }
    });
  });
}
function t() {
  e = new l({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: s.join(o, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), i ? (e.loadURL("http://localhost:5173"), e.webContents.openDevTools()) : (e.loadFile(s.join(o, "../dist/index.html")), e.webContents.openDevTools()), e.on("closed", () => {
    e = null;
  });
}
n.whenReady().then(() => {
  p(), t(), n.on("activate", () => {
    l.getAllWindows().length === 0 && t();
  });
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && n.quit();
});
