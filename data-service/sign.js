"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var signature_adapter_1 = require("@waves/signature-adapter");
var API;
var _userData;
function setSignatureApi(api) {
    API = api;
}
exports.setSignatureApi = setSignatureApi;
function dropSignatureApi() {
    API = null;
}
exports.dropSignatureApi = dropSignatureApi;
function setUserData(userData) {
    _userData = userData;
}
exports.setUserData = setUserData;
function dropUserData() {
    _userData = null;
}
exports.dropUserData = dropUserData;
function getUserAddress() {
    return _userData ? _userData.address : '';
}
exports.getUserAddress = getUserAddress;
function getSignatureApi() {
    if (!API || API.isDestroyed()) {
        try {
            var ConcreteAdapter = signature_adapter_1.getAdapterByType(_userData.userType);
            switch (_userData.userType) {
                case "seed" /* Seed */:
                    setSignatureApi(new ConcreteAdapter(_userData.seed, _userData.networkByte));
                    break;
                case "privateKey" /* PrivateKey */:
                    setSignatureApi(new ConcreteAdapter(_userData.privateKey, _userData.networkByte));
                    break;
                default:
                    setSignatureApi(new ConcreteAdapter(_userData, _userData.networkByte));
            }
        }
        catch (e) {
            return API;
        }
    }
    return API;
}
exports.getSignatureApi = getSignatureApi;
function getDefaultSignatureApi(user) {
    var encryptionRounds = user.settings.get('encryptionRounds');
    var userData = __assign({}, user, { encryptionRounds: encryptionRounds });
    var Adapter = signature_adapter_1.getAdapterByType(user.userType) ||
        signature_adapter_1.getAdapterByType(signature_adapter_1.adapterList[0].type);
    return new Adapter(userData);
}
exports.getDefaultSignatureApi = getDefaultSignatureApi;
//# sourceMappingURL=sign.js.map