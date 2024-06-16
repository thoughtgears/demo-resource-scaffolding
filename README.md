# Demo Resource scaffolding

This is a repository to show the idea to be able to scaffold infrastructure for a cloud run application using terraform,
GitHub Actions and Digger. This will just be a showcase how an opinionated collection of modules could be used during
the action runtime to create the resources needed in GCP to run a cloud run application.

**Note**: The JS code and the Terraform is not optimized  
**Note**: The code is not production ready but just a showcase

The configuration and terraform modules should be very opinionated to use the handlebars templating engine to be able to
generate the configuration files for the cloud run application. This will allow the user to have a single source of
truth for the configuration of the application.

This configuration shows a simple configuration where the service and resources are 1:1 in relation, it assumes
you have a project in GCP for the resources and the service is a cloud run application.

**It`s to showcase the possibilities of the idea rather then a production ready solution**.

## How to use

Generate configuration in the `configuration` folder and run the GitHub action to create the resources in GCP.
The GitHub action will use the `digger` tool to run the terraform against the Google Cloud Platform and will use
workload identity federation to authenticate the project in GCP.

## Configuration

```yaml
version: 1

all:
  gcp_project_id: my-project-1234
  gcp_region: europe-west1
  service: the-store


deployment:
  name: item-api
  description: An API to manage items

  resources:
    firestore:
      db: default
    cloud_run:
      limits:
        memory: 256Mi
        cpu: 1
      max_instances: 1
      concurrency: 80
      env:
        DATA_API_URL: https:/api.data.co/items
      secret_env:
        DATA_API_KEY: data-api-key:latest
```

It can be overwritten by a `env.yaml` file in the `configuration` folder.

```yaml
version: 1

deployment:
  resources:
    cloud_run:
      env:
        DATA_API_URL: https:/dev.data.co/items
        NODE_ENV: production

```

