"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var signature_adapter_1 = require("@waves/signature-adapter");
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var assets_1 = require("../api/assets/assets");
var config_1 = require("../config");
__export(require("./ConfigService"));
function normalizeTime(time) {
    if (typeof time === 'number') {
        return time - config_1.timeDiff;
    }
    else {
        return new Date(time.getTime() - config_1.timeDiff);
    }
}
exports.normalizeTime = normalizeTime;
function normalizeRecipient(recipient) {
    return recipient.replace("alias:" + config_1.get('code') + ":", '');
}
exports.normalizeRecipient = normalizeRecipient;
function coinsMoneyFactory(money, asset) {
    return new data_entities_1.Money(money, asset);
}
exports.coinsMoneyFactory = coinsMoneyFactory;
function tokensMoneyFactory(money, asset) {
    return data_entities_1.Money.fromTokens(money, asset);
}
exports.tokensMoneyFactory = tokensMoneyFactory;
function priceMoneyFactory(money, pair) {
    return data_entities_1.Money.fromTokens(data_entities_1.OrderPrice.fromMatcherCoins(money, pair).getTokens(), pair.priceAsset);
}
exports.priceMoneyFactory = priceMoneyFactory;
function normalizeAssetPair(assetPair) {
    var priceAsset = normalizeAssetId(assetPair.priceAsset);
    var amountAsset = normalizeAssetId(assetPair.amountAsset);
    return { priceAsset: priceAsset, amountAsset: amountAsset };
}
exports.normalizeAssetPair = normalizeAssetPair;
function normalizeUrl(url) {
    var urlObject = new URL(url, document.location.origin);
    var parts = [
        urlObject.host,
        urlObject.pathname,
        urlObject.search,
        urlObject.hash
    ].map(function (item) { return item.replace(/\/\//, '/'); });
    return urlObject.protocol + "//" + parts.join('');
}
exports.normalizeUrl = normalizeUrl;
function normalizeAssetId(assetId) {
    return assetId || signature_adapter_1.WAVES_ID;
}
exports.normalizeAssetId = normalizeAssetId;
function idToNode(id) {
    return id === signature_adapter_1.WAVES_ID ? '' : id;
}
exports.idToNode = idToNode;
function toHash(list, property) {
    return list.reduce(function (result, item) {
        result[item[property]] = item;
        return result;
    }, Object.create(null));
}
exports.toHash = toHash;
function proxyArrayArgs(cb) {
    return function (args) {
        return cb.apply(this, args);
    };
}
exports.proxyArrayArgs = proxyArrayArgs;
function addParam(cb, param) {
    return function (data) { return cb(data, param); };
}
exports.addParam = addParam;
function isPromise(some) {
    return typeof some.then === 'function' && typeof some.catch === 'function';
}
exports.isPromise = isPromise;
function toArray(some) {
    if (Array.isArray(some)) {
        return some;
    }
    else {
        return [some];
    }
}
exports.toArray = toArray;
function dateTime(time) {
    if (typeof time === 'number') {
        return time;
    }
    return time.getTime();
}
exports.dateTime = dateTime;
function addTime(date, count, timeType) {
    return new Date(dateTime(date) + getTime(count, timeType).getTime());
}
exports.addTime = addTime;
function getTime(count, timeType) {
    switch (timeType) {
        case 'second':
            return new Date(count * 1000);
        case 'minute':
            return getTime(60 * count, 'second');
        case 'hour':
            return getTime(60 * count, 'minute');
        case 'day':
            return getTime(24 * count, 'hour');
    }
}
exports.getTime = getTime;
function curryN(deep, cb) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return getCurryCallback(deep, [], cb).apply(void 0, args);
    };
}
exports.curryN = curryN;
function curry(cb) {
    return curryN(cb.length, cb);
}
exports.curry = curry;
function getCurryCallback(deep, args1, cb) {
    return function () {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
        }
        var args3 = args1.concat(args2);
        if (args3.length >= deep) {
            return cb.call.apply(cb, [null].concat(args3));
        }
        else {
            return getCurryCallback(deep, args3, cb);
        }
    };
}
function toBigNumber(some) {
    return some instanceof bignumber_1.BigNumber ? some : new bignumber_1.BigNumber(some);
}
exports.toBigNumber = toBigNumber;
function toAsset(asset) {
    return typeof asset === 'string' ? assets_1.get(asset) : Promise.resolve(asset);
}
exports.toAsset = toAsset;
function defer() {
    var resolve, reject;
    var promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    return { resolve: resolve, reject: reject, promise: promise };
}
exports.defer = defer;
function stringifyJSON(data) {
    return window.WavesApp.stringifyJSON(data);
}
exports.stringifyJSON = stringifyJSON;
var transferFeeList = [];
function clearTransferFee() {
    transferFeeList.splice(0, transferFeeList.length);
}
exports.clearTransferFee = clearTransferFee;
function setTransferFeeItem(item) {
    transferFeeList.push(item);
}
exports.setTransferFeeItem = setTransferFeeItem;
function getTransferFeeList() {
    return transferFeeList
        .filter(function (item) { return item.balance.getTokens().gt(1.005) || item.isMy; })
        .map(function (item) { return item.fee; });
}
exports.getTransferFeeList = getTransferFeeList;
exports.delay = function (timeout) { return new Promise(function (resolve) { return setTimeout(resolve, timeout); }); };
exports.isNativeFunction = (function () {
    var toString = Object.prototype.toString;
    // Используется для разложения на составляющие декомпилированного
    // исходного кода функции
    var fnToString = Function.prototype.toString;
    // Используется для определения конструкторов среды (Safari > 4;
    // по сути, предназначено специально для типизированных массивов)
    var reHostCtor = /^\[object .+?Constructor\]$/;
    // Составление регулярного выражения на основе часто употребляемого
    // нативного метода в качестве шаблона.
    // Выбираем `Object#toString`, так как вполне вероятно, что он ещё не задействован.
    var reNative = RegExp('^' +
        // Применяем `Object#toString` к строке
        String(toString)
            // Избавляемся от любых специальных символов регулярных выражений
            .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
            // Заменяем упоминания `toString` на `.*?`, чтобы сохранить обобщённый вид шаблона.
            // Заменяем `for ...` и тому подобное для поддержки окружений вроде Rhino,
            // которые добавляют дополнительную информацию, такую как арность метода.
            .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
    function isNative(value) {
        var type = typeof value;
        return type == 'function'
            // Используем `Function#toString`, чтобы обойти собственный метод
            // `toString` самого значения и избежать ложного результата.
            ? reNative.test(fnToString.call(value))
            // На всякий случай выполняем проверку на наличие объектов среды, так
            // как некоторые окружения могут представлять компоненты вроде
            // типизированных массивов как методы DOM, что может не соответствовать
            // нормальному нативному паттерну.
            : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
    }
    return isNative;
})();
exports.isNativeNotBound = function (value) {
    if (!value || typeof value.name !== 'string') {
        return false;
    }
    if (!exports.isNativeFunction(value)) {
        return false;
    }
    return value.name.indexOf('bound') === -1;
};
//# sourceMappingURL=utils.js.map