import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

export async function githubWebhookListener(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  console.log(`Received request cons log: ${JSON.stringify(request)}`)
  context.log(`Received request ctx log: ${JSON.stringify(request)}`)
  context.log(`Http function processed request for url "${request.url}"`)

  request.headers.get('x-github-event')
  request.headers.get('x-hub-signature')

  const githubData = request.body || `No data received from GitHub`
  context.log(`Received data from GitHub: ${JSON.stringify(githubData)}`)

  const response = {
    body: JSON.stringify(githubData),
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }
  context.log(`Sending response: ${JSON.stringify(response)}`)
  return response
}

app.http('githubWebhookListener', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'githubwebhooklistener',
  handler: githubWebhookListener,
})
