provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "rg-logicapp-standard"
  location = var.location
}

resource "azurerm_storage_account" "logicapp_storage" {
  name                     = "logicappstdstorage"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_app_service_plan" "logicapp_asp" {
  name                = "logicapp-asp"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  kind                = "elastic"
  reserved            = true

  sku {
    tier = "WorkflowStandard"
    size = "WS1"
  }
}

resource "azurerm_logic_app_standard" "sftp_to_sp" {
  name                       = "logicapp-std-sftp-to-sp"
  location                   = azurerm_resource_group.example.location
  resource_group_name        = azurerm_resource_group.example.name
  app_service_plan_id        = azurerm_app_service_plan.logicapp_asp.id
  storage_account_name       = azurerm_storage_account.logicapp_storage.name
  storage_account_access_key = azurerm_storage_account.logicapp_storage.primary_access_key
  version                    = "~4"
  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "AzureWebJobsStorage"      = azurerm_storage_account.logicapp_storage.primary_connection_string
    "WORKFLOWS_WORKER_RUNTIME" = "node"
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
  }
}
