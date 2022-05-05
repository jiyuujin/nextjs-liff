import { ClientConfig, Client, middleware as lineMiddleware, MiddlewareConfig } from '@line/bot-sdk'

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.NEXT_APP_LIFF_CHANNEL_SECRET,
}

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.NEXT_APP_LIFF_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.NEXT_APP_LIFF_CHANNEL_SECRET || '',
}

export const client = new Client(clientConfig)

export const middleware = lineMiddleware(middlewareConfig)
