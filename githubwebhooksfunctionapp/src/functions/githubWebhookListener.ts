import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { validateSignature } from '../utils/validationUtils'

app.http('githubWebhookListener', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'githubwebhooklistener',
  handler: githubWebhookListener,
})

export async function githubWebhookListener(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    context.log(`Received request: ${JSON.stringify(request)}`)
    const eventType = request.headers.get('X-GitHub-Event')
    const secret = process.env.GHWHS

    if (!secret) {
      context.error('GitHub Webhook Secret is not set')
      throw new Error('Internal Server Error')
    }

    const payload = await request.text()
    const signature = request.headers.get('X-Hub-Signature-256')

    // Compute the hash of the request body
    const isValid = await validateSignature(payload, signature, secret, context)
    if (!isValid) {
      return {
        body: JSON.stringify({ message: 'Unauthorized' }),
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    }

    const githubData = JSON.parse(payload) || `No data received from GitHub`
    context.log(`Received data from GitHub: ${JSON.stringify(githubData)}`)
    // Do the business logic with the data received from GitHub, as needed.

    // Respond back to Gitub with a message to the webhook event
    const response = {
      body: JSON.stringify({ message: `Received ${eventType} event from GitHub successfully` }),
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
    context.log(`Sending response back to github: ${JSON.stringify(response)}`)
    return response
  } catch (error) {
    context.error(`Error occurred:: ${error}`)
    return {
      body: JSON.stringify({ message: 'Internal Server Error' }),
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  }
}
