var Shape, Type, getArgProp, inArray, log, type;

Shape = require("type-utils").Shape;

getArgProp = require("getArgProp");

inArray = require("in-array");

Type = require("Type");

log = require("log");

type = Type("ErrorMap");

type.argumentTypes = {
  config: Shape("ErrorMap_Config", {
    warn: Object.Maybe,
    quiet: Object.Maybe,
    printError: Function,
    printWarning: Function
  })
};

type.argumentDefaults = {
  config: {
    printError: function(error, options) {
      if (options.format == null) {
        options.format = getArgProp("message");
      }
      log.moat(1);
      log.red("Error: ");
      log(options.format(error));
      log.moat(1);
    },
    printWarning: function(error, options) {
      if (options.format == null) {
        options.format = getArgProp("message");
      }
      log.moat(1);
      log.yellow("Warning: ");
      log(options.format(error));
      log.moat(1);
    }
  }
};

type.defineValues({
  _config: getArgProp()
});

type.defineMethods({
  resolve: function(error, options) {
    if (options == null) {
      options = {};
    }
    if (inArray(this._config.quiet, error.message)) {
      return;
    }
    if (inArray(this._config.warn, error.message)) {
      this._config.printWarning(error, options);
    } else {
      this._config.printError(error, options);
    }
  }
});

module.exports = type.build();

//# sourceMappingURL=../../map/src/ErrorMap.map
