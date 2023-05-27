variable "resource_group_location" {
  type        = string
  description = "Resource group location"
  default     = "UK South"
}

variable "network_sg_name" {
  type        = string
  description = "Network security group name"
  default     = "network-security-group"
}

variable "vnet_name" {
  type        = string
  description = "VNet name"
  default     = "jjay-vnet"
}
