const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

async function readFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return yaml.parse(fileContent)
}

async function generateTerraformCode(mergedConfig) {
  const scriptDir = __dirname
  const templatePath = path.join(scriptDir, 'templates', 'terraform-template.hbs')
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(templateSource)

  const terraformConfig = template(mergedConfig)
  const outputPath = 'terraform/generated.tf'
  fs.writeFileSync(outputPath, terraformConfig, 'utf8')
}

module.exports = { readFile, generateTerraformCode }
