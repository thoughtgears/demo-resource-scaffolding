variable "service_name" {
  type        = string
  description = "The name of the service that will be created, to be used to generate the service account"
}

variable "project_id" {
  type        = string
  description = "The project id where the service will be deployed"
}
