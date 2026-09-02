import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import cors from 'cors'
import type { Request, Response } from 'express'
import { createServer } from './server.js'

async function startHttpServer() {
  const port = Number.parseInt(process.env.PORT ?? '3001', 10)
  const app = createMcpExpressApp({ host: '0.0.0.0' })
  app.use(cors())
  app.all('/mcp', async (req: Request, res: Response) => {
    const server = createServer()
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    res.on('close', () => {
      void transport.close()
      void server.close()
    })

    try {
      await server.connect(transport)
      await transport.handleRequest(req, res, req.body)
    } catch {
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal server error' },
          id: null,
        })
      }
    }
  })

  app.listen(port)
}

async function startStdioServer() {
  await createServer().connect(new StdioServerTransport())
}

if (process.argv.includes('--stdio')) {
  await startStdioServer()
} else {
  await startHttpServer()
}
