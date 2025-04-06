"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
class SimpleConnect {
    static listen(port, cb) {
        const server = http_1.createServer((req, res) => {
            let dataString = '';
            req.on('data', (chunk) => {
                dataString += chunk;
            });
            req.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                try {
                    const data = JSON.parse(dataString || 'null');
                    const base = 'http://' + req.headers['host'].toString();
                    const url = new url_1.URL(req.url, base);
                    cb(data, url, req.headers).then((result) => {
                        res.writeHead(200);
                        res.end(result);
                    }).catch((error) => {
                        res.writeHead(400);
                        res.end(String(error) || http_1.STATUS_CODES[400]);
                    });
                }
                catch (e) {
                    res.writeHead(500);
                    res.end(String(e) || http_1.STATUS_CODES[500]);
                }
            });
            req.on('error', (e) => {
                res.writeHead(500);
                res.end(String(e) || http_1.STATUS_CODES[500]);
            });
        });
        server.listen(port);
        return server;
    }
}
exports.SimpleConnect = SimpleConnect;
//# sourceMappingURL=SimpleConnect.js.map