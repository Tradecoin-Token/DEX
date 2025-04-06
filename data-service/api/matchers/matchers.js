"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var utils_1 = require("../../utils/utils");
var config_1 = require("../../config");
function getRates(matcherAddress, pairs) {
    return request_1.request({
        url: config_1.get('api') + "/" + config_1.get('apiVersion') + "/matchers/" + matcherAddress + "/rates",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON({
                pairs: pairs.map(function (pair) { return pair.join('/'); })
            })
        }
    });
}
exports.getRates = getRates;
//# sourceMappingURL=matchers.js.map