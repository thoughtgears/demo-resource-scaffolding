const { readFile, generateTerraformCode } = require('./utils')
const deepmerge = require('deepmerge')
const core = require('@actions/core')

async function run() {
  try {
    const gcp_project_id = core.getInput('gcp_project_id')
    const env = core.getInput('environment', { required: true })
    if (!['dev', 'staging', 'prod'].includes(env)) {
      core.setFailed('Invalid environment, dev, staging or prod are the only valid options')
    }

    const allConfigPath = 'configuration/all.yaml'
    const envConfigPath = `configuration/${env}.yaml`

    const allConfig = await readFile(allConfigPath)
    const devConfig = await readFile(envConfigPath)
    const mergedConfig = deepmerge(allConfig, devConfig)

    if (gcp_project_id) {
      mergedConfig.all.gcp_project_id = gcp_project_id
    }

    await generateTerraformCode(mergedConfig)

    const envString = Object.entries(mergedConfig.deployment.resources.cloud_run.env)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')

    // Convert the secret_env object to a comma-separated string
    const secretEnvString = Object.entries(mergedConfig.deployment.resources.cloud_run.secret_env)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')

    // Debugging: Log the outputs to ensure they are correct
    console.log('deployment_name:', mergedConfig.deployment.name)
    console.log('service_name:', mergedConfig.all.service)
    console.log('cloud_run_cpu_limits:', mergedConfig.deployment.resources.cloud_run.limits.cpu)
    console.log('cloud_run_memory_limits:', mergedConfig.deployment.resources.cloud_run.limits.memory)
    console.log('cloud_run_max_instances:', mergedConfig.deployment.resources.cloud_run.max_instances)
    console.log('cloud_run_concurrency:', mergedConfig.deployment.resources.cloud_run.concurrency)
    console.log('cloud_run_env:', envString)
    console.log('cloud_run_secret_env:', secretEnvString)
    console.log('gcp_project_id:', mergedConfig.all.gcp_project_id)
    console.log('gcp_region:', mergedConfig.all.gcp_region)

    core.setOutput('deployment_name', mergedConfig.deployment.name)
    core.setOutput('service_name', mergedConfig.all.service)
    core.setOutput('cloud_run_cpu_limits', mergedConfig.deployment.resources.cloud_run.limits.cpu)
    core.setOutput('cloud_run_memory_limits', mergedConfig.deployment.resources.cloud_run.limits.memory)
    core.setOutput('cloud_run_max_instances', mergedConfig.deployment.resources.cloud_run.max_instances)
    core.setOutput('cloud_run_concurrency', mergedConfig.deployment.resources.cloud_run.concurrency)
    core.setOutput('cloud_run_env', envString)
    core.setOutput('cloud_run_secret_env', secretEnvString)
    core.setOutput('gcp_project_id', mergedConfig.all.gcp_project_id)
    core.setOutput('gcp_region', mergedConfig.all.gcp_region)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = { run }
