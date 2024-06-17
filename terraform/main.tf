terraform {
  required_version = ">= 1.8.2"
  
  backend "gcs" {
    bucket = "${var.project_id}-terraform-state"
    prefix = "demo-resource-scaffolding"
  }
}

variable "project_id" {
  type        = string
  description = "The project ID to deploy the resources"
}
