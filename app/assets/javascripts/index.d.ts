export { };

declare global {
  interface Window {
    chatId: number | string
    Agent_Name: string
    agentId: any
    featureSwitchUrl: any
    Inq: any
  }
}