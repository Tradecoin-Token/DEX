"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
var ts_utils_1 = require("ts-utils");
var bignumber_1 = require("@waves/bignumber");
var ConfigService = /** @class */ (function () {
    function ConfigService(wavesApp) {
        this.config = Object.create(null);
        this.feeConfig = Object.create(null);
        this.change = new ts_utils_1.Signal();
        if (ConfigService._instance) {
            return ConfigService._instance;
        }
        ConfigService._instance = this;
        this.wavesApp = wavesApp;
        this.configReady = this.fetchConfig();
    }
    ConfigService.prototype.getConfig = function (path) {
        var config = path ? ts_utils_1.get(this.config, path) : this.config;
        return ts_utils_1.clone(config);
    };
    ConfigService.prototype.getFeeConfig = function () {
        return ts_utils_1.clone(this.feeConfig);
    };
    ConfigService.prototype.fetchConfig = function () {
        var _this = this;
        return Promise.all([
            this._getConfig().then(function (config) { return _this._setConfig(config); }),
            this._getFeeConfig().then(function (config) { return _this._setFeeConfig(config); })
        ]);
    };
    ConfigService.prototype._getConfig = function () {
        var _this = this;
        return __1.fetch(this.wavesApp.network.featuresConfigUrl)
            .then(function (data) {
            if (typeof data === 'string') {
                return JSON.parse(data);
            }
            return data;
        })
            .catch(function () { return Promise.resolve(_this.wavesApp.network.featuresConfig); });
    };
    ConfigService.prototype._getFeeConfig = function () {
        var _this = this;
        return __1.fetch(this.wavesApp.network.feeConfigUrl)
            .then(this.wavesApp.parseJSON)
            .then(ConfigService.parseFeeConfig)
            .catch(function () { return Promise.resolve(_this.wavesApp.network.feeConfig); });
    };
    ConfigService.prototype._setFeeConfig = function (config) {
        this.feeConfig = config;
    };
    ConfigService.prototype._setConfig = function (config) {
        var _this = this;
        var myConfig = this.config;
        this.config = config;
        ConfigService.getDifferencePaths(myConfig, config)
            .forEach(function (path) { return _this.change.dispatch(String(path)); });
    };
    ConfigService.getDifferencePaths = function (previous, next) {
        var paths = ts_utils_1.getPaths(next);
        return paths
            .filter(function (path) { return ts_utils_1.get(previous, path) !== ts_utils_1.get(next, path); })
            .map(String);
    };
    ConfigService.parseFeeConfig = function (data) {
        switch (typeof data) {
            case 'number':
            case 'string':
                return new bignumber_1.BigNumber(data);
            case 'object':
                Object.entries(data).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    data[key] = ConfigService.parseFeeConfig(value);
                });
                return data;
            default:
                return data;
        }
    };
    return ConfigService;
}());
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map