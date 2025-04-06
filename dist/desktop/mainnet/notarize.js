var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const notarize = require('electron-notarize').notarize;
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const access = fs.createWriteStream('./out.log');
process.stdout.write = process.stderr.write = access.write.bind(access);
process.on('uncaughtException', function (err) {
    console.error((err && err.stack) ? err.stack : err);
});
function notarizeAppInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout, stderr } = yield exec("\
    { sleep 30 && xcrun altool --notarization-history 0 -u '${appleIdUsername}' -p '${appleIdPassword}' || true ;} && \
    { xcrun altool --notarization-info \$(cat out.log | grep 'checking notarization status' | cut -d':' -f2 | cut -d' ' -f2 | \
        tail -1) -u '${appleIdUsername}' -p '${appleIdPassword}' || true ;} && \
    { xcrun stapler staple -v './release/mainnet/mac/Waves DEX.app' || true ;}");
        console.log(`\${stdout}`);
        if (stderr) {
            console.error("error: \${stderr}");
        }
    });
}
function notarizeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield notarize({
                appBundleId: 'com.wavesplatform.client',
                appPath: 'release/mainnet/mac/Waves DEX.app',
                appleId: '${appleIdUsername}',
                appleIdPassword: '${appleIdPassword}'
            });
        }
        catch (err) {
            console.log(err);
            return true;
        }
    });
}
module.exports = function sequence(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { electronPlatformName } = context;
        if (electronPlatformName === 'darwin') {
            yield notarizeApp();
            yield notarizeAppInfo();
        }
    });
};
//# sourceMappingURL=notarize.js.map