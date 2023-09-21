resource "azurerm_resource_group" "network_rg" {
  name     = "network_rg"
  location = var.resource_group_location
}

resource "azurerm_virtual_network" "vnet" {
  name                = var.vnet_name
  resource_group_name = azurerm_resource_group.network_rg.name
  location            = azurerm_resource_group.network_rg.location
  address_space       = ["10.0.0.0/16"]
}


# resource "azurerm_subnet" "cosmosdb_subnet" {
#   name                 = "cosmosdb-subnet"
#   resource_group_name  = azurerm_resource_group.network_rg.name
#   virtual_network_name = azurerm_virtual_network.vnet.name
#   address_prefixes     = ["10.0.2.0/24"]

#   delegation {
#     name = "delegation"

#     service_delegation {
#       name    = "Microsoft.AzureCosmosDB/clusters"
#       actions = ["Microsoft.Network/virtualNetworks/subnets/join/action", "Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action"]
#     }
#   }
# }

resource "azurerm_subnet" "apim_subnet" {
  name                 = "apim-subnet"
  resource_group_name  = azurerm_resource_group.network_rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/26"]

  service_endpoints = ["Microsoft.EventHub", "Microsoft.KeyVault", "Microsoft.ServiceBus", "Microsoft.Sql", "Microsoft.Storage"]

}


resource "azurerm_network_security_group" "nsg_apim" {
  name                = "nsg_apim"
  location            = azurerm_resource_group.network_rg.location
  resource_group_name = azurerm_resource_group.network_rg.name

  security_rule {
    name                       = "AllowApimInbound"
    description                = "Management endpoint for Azure portal and PowerShell"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3443"
    source_address_prefix      = "ApiManagement"
    destination_address_prefix = "VirtualNetwork"
  }
  security_rule {
    name                       = "AllowALBInbound"
    description                = "Azure Infrastructure Load Balancer (required for Premium service tier)"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "VirtualNetwork"
  }

  security_rule {
    name                       = "AllowStorageOutbound"
    description                = "Dependency on Azure Storage"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "Storage"
  }
  security_rule {
    name                       = "AllowSqlOutbound"
    description                = "Access to Azure SQL endpoints"
    priority                   = 110
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "1443"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "SQL"
  }
}

resource "azurerm_subnet_network_security_group_association" "apim_subnet_nsg_association" {
  subnet_id                 = azurerm_subnet.apim_subnet.id
  network_security_group_id = azurerm_network_security_group.nsg_apim.id
}



resource "azurerm_public_ip" "pip-apim" {
  name                = "pip-apim"
  resource_group_name = azurerm_resource_group.network_rg.name
  location            = azurerm_resource_group.network_rg.location
  allocation_method   = "Static"
  domain_name_label   = "pip-apim"
  sku                 = "Standard"
}


resource "azurerm_api_management" "apim" {
  name                = "jjay-apim"
  location            = azurerm_resource_group.network_rg.location
  resource_group_name = azurerm_resource_group.network_rg.name
  publisher_name      = "Jay Company"
  publisher_email     = "india.jai@gmail.com"

  sku_name = "Developer_1"

  public_ip_address_id = azurerm_public_ip.pip-apim.id
  virtual_network_type = "Internal"

  virtual_network_configuration {
    subnet_id = azurerm_subnet.apim_subnet.id
  }
}
