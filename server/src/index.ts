
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { IncomingMessage, ServerResponse } from 'http';
import { createClickInputSchema } from './schema';
import { createClick } from './handlers/impl/create_click';
import { getClickCount } from './handlers/impl/get_click_count';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Click tracking endpoints
  recordClick: publicProcedure
    .input(createClickInputSchema)
    .mutation(({ input }) => createClick(input)),
  
  getClickCount: publicProcedure
    .query(() => getClickCount()),
});

export type AppRouter = typeof appRouter;

function healthCheckMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  next();
}

async function start() {
  const port = process.env['PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      healthCheckMiddleware(req, res, next);
      cors()(req, res, next);
    },
    router: appRouter,
    createContext(opts) {
      // You can extract IP address and user agent from the request
      const getClientIP = () => {
        const forwarded = opts.req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') {
          return forwarded.split(',')[0].trim();
        }
        return opts.req.socket.remoteAddress || null;
      };

      return {
        ip: getClientIP(),
        userAgent: opts.req.headers['user-agent'] || null
      };
    },
  });
  
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
