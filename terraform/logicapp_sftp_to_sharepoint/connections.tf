data "azurerm_key_vault" "my_kv" {
  name                = "your-keyvault-name"
  resource_group_name = "your-keyvault-resourcegroup"
}

data "azurerm_key_vault_secret" "sftp_key" {
  name         = "sftp-private-key"
  key_vault_id = data.azurerm_key_vault.my_kv.id
}

data "azurerm_key_vault_secret" "sftp_user" {
  name         = "sftp-username"
  key_vault_id = data.azurerm_key_vault.my_kv.id
}

data "azurerm_key_vault_secret" "sp_client_id" {
  name         = "sharepoint-client-id"
  key_vault_id = data.azurerm_key_vault.my_kv.id
}

data "azurerm_key_vault_secret" "sp_client_secret" {
  name         = "sharepoint-client-secret"
  key_vault_id = data.azurerm_key_vault.my_kv.id
}

data "azurerm_key_vault_secret" "sp_tenant" {
  name         = "sharepoint-tenant-id"
  key_vault_id = data.azurerm_key_vault.my_kv.id
}

resource "azurerm_api_connection" "sftp" {
  name                = "sftp-connection"
  location            = "East US"
  resource_group_name = "your-keyvault-resourcegroup"
  managed_api_id      = "sftp"
  display_name        = "My SFTP"

  parameter_values = {
    host              = "sftp.yourdomain.com"
    port              = "22"
    authenticationType = "PrivateKey"
    username          = data.azurerm_key_vault_secret.sftp_user.value
    privateKey        = data.azurerm_key_vault_secret.sftp_key.value
  }
}

resource "azurerm_api_connection" "sharepoint" {
  name                = "sharepoint-connection"
  location            = "East US"
  resource_group_name = "your-keyvault-resourcegroup"
  managed_api_id      = "sharepointonline"
  display_name        = "My SharePoint"

  parameter_values = {
    authenticationType = "Raw"
    token = jsonencode({
      client_id     = data.azurerm_key_vault_secret.sp_client_id.value
      client_secret = data.azurerm_key_vault_secret.sp_client_secret.value
      tenant        = data.azurerm_key_vault_secret.sp_tenant.value
      grant_type    = "client_credentials"
      resource      = "https://graph.microsoft.com"
    })
  }
}