"use strict";const s=require("electron");s.contextBridge.exposeInMainWorld("electronAPI",{sendMessage:e=>{s.ipcRenderer.send("message",e)},onMessage:e=>{s.ipcRenderer.on("message",(r,n)=>e(n))}});
