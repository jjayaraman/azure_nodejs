import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"

export const getSecret = async (keyVaultName: string, secretName: string): Promise<string> => {
  const credential = new DefaultAzureCredential()
  const client = new SecretClient(`https://${keyVaultName}.vault.azure.net`, credential)
  const secret = await client.getSecret(secretName)
  return secret.value
}
