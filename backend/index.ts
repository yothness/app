const st = Date.now();

import { serve } from '@hono/node-server'
import app from './app';

serve({
  fetch: app.fetch,
  port: 3000
}, () => console.debug("[SERVER:INNERFLIX:OPENED] " + (Date.now() - st) + "ms"))