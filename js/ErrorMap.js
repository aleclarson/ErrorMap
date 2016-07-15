var Shape, Type, fromArgs, inArray, isConstructor, log, type;

isConstructor = require("isConstructor");

fromArgs = require("fromArgs");

inArray = require("in-array");

Shape = require("Shape");

Type = require("Type");

log = require("log");

type = Type("ErrorMap");

type.optionTypes = {
  warn: Array.Maybe,
  quiet: Array.Maybe,
  onError: Function,
  onWarning: Function
};

type.optionDefaults = {
  onError: function(error, options) {
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
  onWarning: function(error, options) {
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
};

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
  }
});

module.exports = type.build();

//# sourceMappingURL=map/ErrorMap.map
