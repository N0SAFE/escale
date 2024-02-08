declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    api: {
      success: (data: any, status?: number) => void
      error: (message: string, status?: number) => void
    }
  }
}
