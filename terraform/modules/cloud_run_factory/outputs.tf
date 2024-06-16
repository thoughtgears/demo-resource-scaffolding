output "service_account_email" {
  value       = google_service_account.this.email
  description = "The email of the service account that will be used by the Cloud Run service"
}
