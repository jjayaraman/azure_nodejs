
resource "azurerm_api_management" "product_api_m" {
  name                = "jay-product-api-management"
  resource_group_name = azurerm_resource_group.product_rg.name
  location            = azurerm_resource_group.product_rg.location
  sku_name            = "Consumption_0"
  publisher_name      = "Jayakumar Jayaraman"
  publisher_email     = var.publisher_email
}

resource "azurerm_api_management_api" "product_api" {
  name                = "product-api"
  resource_group_name = azurerm_resource_group.product_rg.name
  api_management_name = azurerm_api_management.product_api_m.name
  revision            = "1"
  display_name        = "Product API"
  path                = "product"
  protocols           = ["https"]
  service_url         = var.service_url
}

resource "azurerm_api_management_api_operation" "product_api_create" {
  operation_id        = "product-create"
  api_management_name = azurerm_api_management.product_api_m.name
  api_name            = azurerm_api_management_api.product_api.name
  resource_group_name = azurerm_resource_group.product_rg.name
  method              = "POST"
  display_name        = "Create a product"
  description         = "This API is used to create a new product"
  url_template        = "create"

  response {
    status_code = 201
  }
}
