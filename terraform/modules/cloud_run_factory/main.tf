resource "google_service_account" "this" {
  project      = var.project_id
  account_id   = "run-${var.service_name}"
  display_name = "[RUN] ${title(var.service_name)}"
}
