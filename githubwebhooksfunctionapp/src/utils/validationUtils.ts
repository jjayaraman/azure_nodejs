import { InvocationContext } from '@azure/functions'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Validate the request signature
 *
 * @param request
 * @param context
 * @param secret
 * @returns
 */
export const validateSignature = async (payload: string, signature: string, secret: string, context: InvocationContext) => {
  if (!signature || !secret || !payload || !signature?.startsWith('sha256=')) {
    context.error('validateSignature() - Invalid inputs')
    return false
  }

  const computedSignature = createHmac('sha256', secret).update(payload).digest('hex')
  context.log(`Computed signature: ${computedSignature}`)

  const expectedSignature = signature?.split('=')[1]
  context.log(`Expected signature: ${expectedSignature}`)

  const isValid = timingSafeEqual(Buffer.from(computedSignature, 'hex'), Buffer.from(expectedSignature, 'hex'))
  context.log(`Is valid signature: ${isValid}`)

  return isValid
}
