import { Hono } from 'hono'
import Page from './pages'

const app = new Hono()

app.get('/gen_204', (c) => new Response(void 0, { status: 204 }))

app.get('/', Page("home"))
app.get('/about', Page("about"))
app.get('/news_update', Page("news_update"))
app.get('/preferences', Page("preferences"))
app.get('/families', Page("families"))
app.get('/apps/services', Page("apps_services"))

export default app
