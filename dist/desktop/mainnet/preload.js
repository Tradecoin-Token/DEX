"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("./Storage");
const electron_1 = require("electron");
const SimpleConnect_1 = require("./SimpleConnect");
process.once('loaded', () => {
    const g = global;
    g.WebStorage = new Storage_1.Storage();
    g.openInBrowser = function (url) {
        electron_1.shell.openExternal(url);
    };
    g.isDesktop = true;
    g.SimpleConnect = SimpleConnect_1.SimpleConnect;
    try {
        g.TransportNodeHid = require('@ledgerhq/hw-transport-node-hid');
    }
    catch (e) {
    }
    const transferModule = electron_1.remote.require('./transfer');
    g.transfer = transferModule.transfer;
});
//# sourceMappingURL=preload.js.map