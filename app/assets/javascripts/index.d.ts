export { };

declare global {
  interface Window {
    chatId: number | string
    Agent_Name: string
    featureSwitchUrl: string
    Inq: any
  }
}