export interface IElectronAPI {
  sendMessage: (message: string) => void
  onMessage: (callback: (message: string) => void) => void
  openExternal: (url: string) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
