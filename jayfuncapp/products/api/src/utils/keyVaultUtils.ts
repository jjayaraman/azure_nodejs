const { SecretClient } = require('@azure/keyvault-secrets')
const { DefaultAzureCredential } = require('@azure/identity')

const getClient = () => {
  const keyVaultName = process.env.KEY_VAULT_NAME || 'jjaykeyvault'
  const url = 'https://' + keyVaultName + '.vault.azure.net'
  const credential = new DefaultAzureCredential()
  const client = new SecretClient(url, credential)
  return client
}

export const createSecret = async (secretName: string, secretValue: string) => {
  const client = await getClient()
  const result = await client.setSecret(secretName, secretValue)
  if (result) {
    console.info(`Set secret ${secretName} created successfully`)
  }
}

export const getSecretValue = async (secretName: string) => {
  // Read the secret we created
  const client = await getClient()
  const secret = await client.getSecret(secretName)
  console.log(`Secret retrieved for secretName: ${secretName} `)
  return secret
}

export const deleteSecret = async (secretName: string) => {
  const client = await getClient()
  await client.beginDeleteSecret(secretName)
  console.log(`Secret deleted for secretName: ${secretName}`)
}
