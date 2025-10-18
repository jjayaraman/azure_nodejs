provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "rg-logicapp-sftp"
  location = "East US"
}

resource "azurerm_logic_app_workflow" "sftp_to_sp" {
  name                = "logicapp-sftp-to-sharepoint"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  definition = file("${path.module}/workflow-definition.json")

  parameters = {
    "$connections" = jsonencode({
      "sftp" = {
        "connectionId"   = azurerm_api_connection.sftp.id
        "connectionName" = azurerm_api_connection.sftp.name
        "id"             = "/subscriptions/${var.subscription_id}/providers/Microsoft.Web/locations/${var.location}/managedApis/sftp"
      },
      "sharepointonline" = {
        "connectionId"   = azurerm_api_connection.sharepoint.id
        "connectionName" = azurerm_api_connection.sharepoint.name
        "id"             = "/subscriptions/${var.subscription_id}/providers/Microsoft.Web/locations/${var.location}/managedApis/sharepointonline"
      }
    })
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = "dev"
  }
}