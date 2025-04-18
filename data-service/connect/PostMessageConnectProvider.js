"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var waves_browser_bus_1 = require("@waves/waves-browser-bus");
var utils_1 = require("../utils/utils");
var PostMessageConnectProvider = /** @class */ (function () {
    function PostMessageConnectProvider(options) {
        if (options === void 0) { options = {}; }
        this.adapter = new waves_browser_bus_1.WindowAdapter([new waves_browser_bus_1.WindowProtocol(window, waves_browser_bus_1.WindowProtocol.PROTOCOL_TYPES.LISTEN)], [new waves_browser_bus_1.WindowProtocol(options.win, waves_browser_bus_1.WindowProtocol.PROTOCOL_TYPES.DISPATCH)], { origins: options.origins });
        this.bus = new waves_browser_bus_1.Bus(this.adapter);
        this.active = true;
    }
    PostMessageConnectProvider.prototype.send = function (data, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, timeout, _b, attempts, i, res, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.checkActive();
                        _a = options.timeout, timeout = _a === void 0 ? 5000 : _a, _b = options.attempts, attempts = _b === void 0 ? 1 : _b;
                        i = attempts;
                        _c.label = 1;
                    case 1:
                        if (!(i > 0)) return [3 /*break*/, 7];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.bus.request(options.event, data, options.timeout)];
                    case 3:
                        res = _c.sent();
                        return [2 /*return*/, JSON.parse(res)];
                    case 4:
                        e_1 = _c.sent();
                        return [4 /*yield*/, utils_1.delay(timeout)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        i--;
                        return [3 /*break*/, 1];
                    case 7: throw new Error('Could not connect');
                }
            });
        });
    };
    PostMessageConnectProvider.prototype.listen = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.checkActive();
                this.bus.registerRequestHandler('data', function (data) {
                    return cb(JSON.parse(data));
                });
                return [2 /*return*/];
            });
        });
    };
    PostMessageConnectProvider.prototype.destroy = function () {
        try {
            this.bus.destroy();
        }
        catch (e) {
        }
        this.active = false;
    };
    PostMessageConnectProvider.prototype.checkActive = function () {
        if (!this.active) {
            throw new Error('Provider was destroyed');
        }
    };
    return PostMessageConnectProvider;
}());
exports.PostMessageConnectProvider = PostMessageConnectProvider;
//# sourceMappingURL=PostMessageConnectProvider.js.map