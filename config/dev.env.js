'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DATA_SERVER: '"http://localhost:4000"',
  WEBSOCKET_SERVER: '"ws://localhost:8000"',
})
