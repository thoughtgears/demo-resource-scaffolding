terraform {
  required_version = ">= 1.8.2"
}

variable "project_id" {
  type        = string
  description = "The project ID to deploy the resources"
}
