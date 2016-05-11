
{ Shape } = require "type-utils"

getArgProp = require "getArgProp"
inArray = require "in-array"
Type = require "Type"
log = require "log"

type = Type "ErrorMap"

type.argumentTypes =
  config: Shape "ErrorMap_Config", {
    warn: Object.Maybe
    quiet: Object.Maybe
    printError: Function
    printWarning: Function
  }

type.argumentDefaults =
  config: {
    printError: (error, options) ->
      options.format ?= getArgProp "message"
      log.moat 1
      log.red "Error: "
      log options.format error
      log.moat 1
      return
    printWarning: (error, options) ->
      options.format ?= getArgProp "message"
      log.moat 1
      log.yellow "Warning: "
      log options.format error
      log.moat 1
      return
  }

type.defineValues

  _config: getArgProp()

type.defineMethods

  resolve: (error, options = {}) ->
    return if inArray @_config.quiet, error.message
    if inArray @_config.warn, error.message
      @_config.printWarning error, options
    else @_config.printError error, options
    return

module.exports = type.build()
