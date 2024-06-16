const { readFile, generateTerraformCode } = require('./utils')
const deepmerge = require('deepmerge')
const core = require('@actions/core')

async function run() {
  try {
    const gcp_project_id = core.getInput('gcp_project_id')
    const env = core.getInput('environment', { required: true })
    if (!['dev', 'staging', ['prod']].includes(env)) {
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

    const envString = Object.entries(mergedConfig.deployment.env)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')

    // Convert the secret_env object to a comma-separated string
    const secretEnvString = Object.entries(mergedConfig.deployment.secret_env)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')

    core.setOutput('deployment_name', mergedConfig.deployment.name)
    core.setOutput('service_name', mergedConfig.all.service)
    core.setOutput('cloud_run_cpu_limits', mergedConfig.deployment.limits.cpu)
    core.setOutput('cloud_run_memory_limits', mergedConfig.deployment.limits.memory)
    core.setOutput('cloud_run_max_instances', mergedConfig.deployment.max_instances)
    core.setOutput('cloud_run_concurrency', mergedConfig.deployment.concurrency)
    core.setOutput('cloud_run_env', envString)
    core.setOutput('cloud_run_secret_env', secretEnvString)
    core.setOutput('gcp_project_id', mergedConfig.all.gcp_project_id)
    core.setOutput('gcp_region', mergedConfig.all.gcp_region)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = { run }
