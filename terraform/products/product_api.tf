
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

# Create product /create
resource "azurerm_api_management_api_operation" "product_api_create" {
  operation_id        = "product-create"
  api_management_name = azurerm_api_management.product_api_m.name
  api_name            = azurerm_api_management_api.product_api.name
  resource_group_name = azurerm_resource_group.product_rg.name
  method              = "POST"
  display_name        = "Create a product"
  description         = "This API is used to create a new product"
  url_template        = "/create"

  response {
    status_code = 201
  }
}

# Update product /update
resource "azurerm_api_management_api_operation" "product_api_update" {
  operation_id        = "product-update"
  api_management_name = azurerm_api_management.product_api_m.name
  api_name            = azurerm_api_management_api.product_api.name
  resource_group_name = azurerm_resource_group.product_rg.name
  method              = "PUT"
  display_name        = "Update  a product"
  description         = "This API is used to update a product"
  url_template        = "/update"

  response {
    status_code = 200
  }
}


# Get all products /getall
resource "azurerm_api_management_api_operation" "product_api_getall" {
  operation_id        = "product-getall"
  api_management_name = azurerm_api_management.product_api_m.name
  api_name            = azurerm_api_management_api.product_api.name
  resource_group_name = azurerm_resource_group.product_rg.name
  method              = "GET"
  display_name        = "Get all products"
  description         = "This API is used to get all products"
  url_template        = "/getall"

  response {
    status_code = 200
  }
}

# Get all products /getbyid/{id}
resource "azurerm_api_management_api_operation" "product_api_getbyid" {
  operation_id        = "product-getbyid"
  api_management_name = azurerm_api_management.product_api_m.name
  api_name            = azurerm_api_management_api.product_api.name
  resource_group_name = azurerm_resource_group.product_rg.name
  method              = "GET"
  display_name        = "Get product by id"
  description         = "This API is used to get a product by id"
  url_template        = "/getbyid/{id}"

  response {
    status_code = 200
  }
}
