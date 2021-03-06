var Type, fromArgs, inArray, isConstructor, log, type;

isConstructor = require("isConstructor");

fromArgs = require("fromArgs");

inArray = require("in-array");

Type = require("Type");

log = require("log");

type = Type("ErrorMap");

type.defineOptions({
  warn: Array,
  quiet: Array,
  onError: Function,
  onWarning: Function
});

type.defineValues({
  _warn: fromArgs("warn"),
  _quiet: fromArgs("quiet"),
  _onError: fromArgs("onError"),
  _onWarning: fromArgs("onWarning")
});

type.defineMethods({
  resolve: function(error, options) {
    if (isConstructor(options, Function)) {
      options = {
        header: options
      };
    } else {
      if (options == null) {
        options = {};
      }
    }
    if (inArray(this._quiet, error.message)) {
      if (typeof error["catch"] === "function") {
        error["catch"]();
      }
      return;
    }
    if (inArray(this._warn, error.message)) {
      if (typeof error["catch"] === "function") {
        error["catch"]();
      }
      this._onWarning(error, options);
      return;
    }
    this._onError(error, options);
  },
  _onError: function(error, options) {
    log.moat(1);
    if (options.header) {
      options.header();
      log.moat(0);
    }
    log.red("Error: ");
    log.white(error.message);
    log.moat(1);
    if (isDev) {
      log.gray.dim(error.stack.split(log.ln).slice(1).join(log.ln));
      log.moat(1);
    }
  },
  _onWarning: function(error, options) {
    log.moat(1);
    if (options.header) {
      options.header();
      log.moat(0);
    }
    log.yellow("Warning: ");
    log.white(error.message);
    log.moat(1);
    if (isDev) {
      log.gray.dim(error.stack.split(log.ln).slice(1).join(log.ln));
      log.moat(1);
    }
  }
});

module.exports = type.build();

//# sourceMappingURL=map/ErrorMap.map
