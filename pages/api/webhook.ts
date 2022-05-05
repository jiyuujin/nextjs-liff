import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Middleware } from '@line/bot-sdk/lib/middleware'
import { WebhookRequestBody } from '@line/bot-sdk'
import * as line from '../../lib/line'

export const config = { api: { bodyParser: false } }

async function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Middleware) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)))
  })
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await runMiddleware(req, res, line.middleware)

      const body: WebhookRequestBody = req.body
      await Promise.all(
        body.events.map((event) =>
          (async () => {
            if (event.mode === 'active') {
              if (event.type == 'message') {
                const name = event.source.userId
                  ? (await line.client.getProfile(event.source.userId)).displayName
                  : 'User'
                await line.client.replyMessage(event.replyToken, {
                  type: 'text',
                  text: `Hi, ${name}!`,
                })
              } else if (event.type == 'follow') {
                //
              }
            }
          })(),
        ),
      )
      res.status(200).end()
    } else {
      res.status(405).end()
    }
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
