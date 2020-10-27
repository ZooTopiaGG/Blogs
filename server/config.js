'use-strict'

const defaultConfig = './config-default.js'
const overrideConfig = './config-override.js'
const testConfig = './config-test.js'

const fs = require('fs')
const path = require('path')

function join(config) {
  return path.join(__dirname, config)
}

var config = null
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
  console.log(`Load ${testConfig}...`)
  config = require(testConfig)
} else {
  console.log(`Load ${defaultConfig}...`)
  config = require(defaultConfig)
  try {
    if (fs.statSync(join(overrideConfig)).isFile()) {
      console.log(`Load ${overrideConfig}...`)
      config = Object.assign(config, require(overrideConfig))
    }
  } catch (err) {
    console.log(`Cannot load ${overrideConfig}.`)
  }
}

module.exports = config