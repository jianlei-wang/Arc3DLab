import { contextBridge, ipcRenderer } from 'electron'

// 向渲染进程暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：发送消息到主进程
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },
  // 示例：接收来自主进程的消息
  onMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('message', (_event, message) => callback(message))
  },
  // 在默认浏览器中打开 URL
  openExternal: (url: string) => {
    ipcRenderer.send('open-external', url)
  },
})
