export interface IElectronAPI {
  sendMessage: (message: string) => void
  onMessage: (callback: (message: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
