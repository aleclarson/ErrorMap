
isConstructor = require "isConstructor"
fromArgs = require "fromArgs"
inArray = require "in-array"
Type = require "Type"
log = require "log"

type = Type "ErrorMap"

type.defineOptions
  warn: Array
  quiet: Array
  onError: Function
  onWarning: Function

type.defineValues

  _warn: fromArgs "warn"

  _quiet: fromArgs "quiet"

  _onError: fromArgs "onError"

  _onWarning: fromArgs "onWarning"

type.defineMethods

  resolve: (error, options) ->

    if isConstructor options, Function
      options = { header: options }
    else options ?= {}

    if inArray @_quiet, error.message
      error.catch?()
      return

    if inArray @_warn, error.message
      error.catch?()
      @_onWarning error, options
      return

    @_onError error, options
    return

  _onError: (error, options) ->
    log.moat 1
    if options.header
      options.header()
      log.moat 0
    log.red "Error: "
    log.white error.message
    log.moat 1
    if isDev
      log.gray.dim error.stack.split(log.ln).slice(1).join(log.ln)
      log.moat 1
    return

  _onWarning: (error, options) ->
    log.moat 1
    if options.header
      options.header()
      log.moat 0
    log.yellow "Warning: "
    log.white error.message
    log.moat 1
    if isDev
      log.gray.dim error.stack.split(log.ln).slice(1).join(log.ln)
      log.moat 1
    return

module.exports = type.build()
