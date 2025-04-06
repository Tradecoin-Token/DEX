"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const utils_1 = require("./utils");
class Storage {
    constructor() {
        this.activeWrite = Promise.resolve();
        this.storagePath = path_1.join(electron_1.remote.app.getPath('userData'), 'storage.json');
        this.ready = this.initializeStorageCache();
    }
    readStorage(key) {
        return this.ready.then(() => this.storageCache[key]);
    }
    writeStorage(key, value) {
        return this.ready.then(() => {
            if (this.storagePath[key] === value) {
                return void 0;
            }
            this.storageCache[key] = value;
            this.activeWrite = this.activeWrite
                .then(() => utils_1.writeJSON(this.storagePath, this.storageCache));
            return this.activeWrite;
        });
    }
    clearStorage() {
        this.storageCache = Object.create(null);
        return utils_1.writeJSON(this.storagePath, this.storageCache);
    }
    createNotification(title, body) {
        utils_1.localeReady.then(t => {
            new Notification(t(title), {
                body: t(body)
            });
        });
    }
    initializeStorageCache() {
        this.storageCache = Object.create(null);
        return utils_1.exist(this.storagePath)
            .then(exist => {
            if (exist) {
                return utils_1.readJSON(this.storagePath)
                    .then(cache => {
                    Object.assign(this.storageCache, cache);
                    return Storage.createBackup(cache);
                })
                    .catch(() => this.restoreFromBackup());
            }
            else {
                return Storage.getBackupFileNames().then(list => list.length ? this.restoreFromBackup() : void 0);
            }
        })
            .catch(() => this.restoreFromBackup());
    }
    restoreFromBackup() {
        return Storage.markAsBroken(this.storagePath)
            .catch(() => void 0)
            .then(Storage.getBackupFileNames)
            .then(names => {
            const loop = (index) => {
                if (!names[index]) {
                    return Promise.reject('Has no available backup file!');
                }
                const path = path_1.join(electron_1.remote.app.getPath('userData'), names[index]);
                return utils_1.readJSON(path)
                    .catch(() => Storage.markAsBroken(path)
                    .then(() => loop(index + 1)));
            };
            return loop(0);
        })
            .then(cache => {
            this.createNotification('storage.read.error.title', 'storage.read.error.body');
            Object.assign(this.storageCache, cache);
        })
            .catch(() => {
            this.createNotification('storage.backup.error.title', 'storage.backup.error.body');
        });
    }
    static markAsBroken(path) {
        const fileName = path_1.basename(path, '.json');
        return utils_1.rename(path, path.replace(`${fileName}.json`, `${fileName}_broken_${Date.now()}.json`));
    }
    static createBackup(data) {
        return Storage.getBackupFileNames().then(names => {
            return names.length ? utils_1.read(path_1.join(electron_1.remote.app.getPath('userData'), Storage.head(names))) : Promise.resolve('');
        }).then(content => {
            if (content === JSON.stringify(data)) {
                return undefined;
            }
            const name = `backup_${Date.now()}.json`;
            return utils_1.writeJSON(path_1.join(electron_1.remote.app.getPath('userData'), name), data)
                .then(Storage.getBackupFileNames)
                .then(list => {
                if (list.length >= Storage.backupCount) {
                    Storage.removeOldBackup(list);
                }
            });
        });
    }
    static getBackupFileNames() {
        return utils_1.readdir(electron_1.remote.app.getPath('userData'))
            .then(list => list.filter(name => /backup(_\d+)?\.json/.test(name)))
            .then(list => list.map(name => Number(Storage.head(name.match(/\d+/g) || []) || 0)))
            .then(list => list.sort((a, b) => b - a))
            .then(list => list.map(date => date ? `backup_${date}.json` : 'backup.json'));
    }
    static removeOldBackup(list) {
        list.slice(Storage.backupCount + 1).forEach(name => {
            utils_1.unlink(path_1.join(electron_1.remote.app.getPath('userData'), name));
        });
    }
    static head(array) {
        return array[0];
    }
}
Storage.backupCount = 100;
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map