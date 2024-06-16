resource "google_artifact_registry_repository" "this" {
  project       = "my-project-1234"
  location      = "europe-west1"
  repository_id = "the-store"
  format        = "DOCKER"
}

module "cloud_run" {
  source = "./modules/cloud_run_factory"

  project_id             = "my-project-1234"
  service_name           = "item-api"
}

output "cloud_run_service_account_email" {
  value = module.cloud_run.service_account_email
  description = "The email address of the service account used by the Cloud Run service."
}
