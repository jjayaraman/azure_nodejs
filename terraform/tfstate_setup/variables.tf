variable "tfstate_resource_group_name" {
  type        = string
  description = "Terraform state setup resource group name"
  default     = "tfstate_rg"
}

variable "resource_group_location" {
  type        = string
  description = "All resource group location"
  default     = "UK South"
}

variable "tfstate_storage_account_name" {
  type        = string
  description = "Terraform state storage account name"
}

variable "tfstate_storage_container_name" {
  type        = string
  description = "Terraform state storage container name"
  default     = "tfstate"
}
