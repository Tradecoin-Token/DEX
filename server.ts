import { createSecureServer } from 'http2';
import { createServer } from 'https';
import { route, parseArguments, stat } from './ts-scripts/utils';
import { readFileSync, readdirSync } from 'fs';
import { serialize, parse as parserCookie } from 'cookie';
import { compile } from 'handlebars';
import { parse } from 'url';
import { TBuild, TConnection, TPlatform } from './ts-scripts/interface';
import { readFile } from 'fs-extra';
import { join, basename, extname } from 'path';
import * as fs from 'fs';
import * as qs from 'querystring';
import * as opn from 'opn';

const ip = require('my-local-ip')();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const connectionTypes: Array<TConnection> = ['mainnet', 'testnet'];
const buildTypes: Array<TBuild> = ['development', 'production'];
const privateKey = readFileSync('localhost.key').toString();
const certificate = readFileSync('localhost.crt').toString();
const args = parseArguments() || Object.create(null);

const handler = function (req, res) {
    const url = parse(req.url);

    const parts = ['event-sender', 'amplitude', 'googleAnalytics'];

    if (parts.some(item => req.url.includes(item))) {
        stat(req, res, [__dirname, join(__dirname, 'node_modules/@waves')]);
        return null;
    }

    if (url.href.includes('/choose/')) {
        const [platform, connection, build] = url.href.replace('/choose/', '').split('/');
        const cookie = serialize('session', `${platform},${connection},${build}`, {
            maxAge: 60 * 60 * 24,
            path: '/'
        });

        res.setHeader('Set-Cookie', cookie);
        res.statusCode = 302;
        res.setHeader('Location', req.headers.referer);
        res.end();

        return null;
    }

    if (req.url.includes('/package.json')) {
        res.end(readFileSync(join(__dirname, 'package.json')));
        return null;
    }

    const parsed = parseCookie(req.headers.cookie);

    if (!parsed) {
        readFile(join(__dirname, 'chooseBuild.hbs'), 'utf8').then((file) => {
            res.end(compile(file)({ links: getBuildsLinks(req.headers['user-agent']) }));
        });
    } else {
        route(parsed.connection, parsed.build, parsed.platform)(req, res);
    }
};

function createMyServer(port: number) {
    const server = createSecureServer({ key: privateKey, cert: certificate });
    const url = `https://localhost:${port}`;

    server.addListener('request', request);
    server.listen(port);

    console.log(`Listen port ${port}...`);
    console.log('Available urls:');
    console.log(url);

    if (args.openUrl) {
        //opn(url);
    }
}

function createSimpleServer({ port = 8000 }) {
    const server = createServer({ key: privateKey, cert: certificate });
    server.addListener('request', request);
    server.listen(port);
    console.log(`Listen port ${port}, for simple server`);
    console.log(`https://${ip}:${port}`);
}

createMyServer(args.port || 8081);

if (args.startSimple) {
    createSimpleServer(args);
}

function getBuildsLinks(userAgent: string = ''): Array<{ url: string; text: string }> {
    const result = [];
    const platform: TPlatform = userAgent.includes('Electron') ? 'desktop' : 'web';

    readdirSync(join(__dirname, 'configs'))
        .map(config => basename(config, extname(config)))
        .forEach((connection) => {
            buildTypes.forEach((build) => {
                result.push({
                    url: `/choose/${platform}/${connection}/${build}`,
                    text: `${platform} ${connection} ${build}`
                });
            });
        });

    return result;
}

function parseCookie(header = ''): IRequestData {
    const [platform, connection, build] = ((parserCookie(header) || Object.create(null)).session || '').split(',');
    if (!(build && connection && platform)) {
        return null;
    }
    return { platform, connection, build } as IRequestData;
}

const handlers = [
    coinomat,
    wavesClientConfig,
    handler as any
];

function request(req, res) {
    let index = 0;

    function next() {
        index++;
        if (handlers[index - 1]) {
            handlers[index - 1](req, res, next);
        }
    }

    next();
}

function wavesClientConfig(req, res, next) {
    const parsedCookie = parseCookie(req.headers.cookie);
    const connection: string | null = parsedCookie ? parsedCookie.connection : null;

    if (!req.url.includes('waves-client-config') || !connection) {
        next();
        return null;
    }
    let response_json = { error: 'oops' };

    const path = join(
        __dirname,
        `mocks/waves-client-config/master/${connection === 'mainnet' ? '' : 'testnet.'}config.json`
    );

    if (fs.existsSync(path)) {
        response_json = JSON.parse(fs.readFileSync(path, 'utf8')) || '';
    }

    const cType = 'text/html; charset=utf-8;';
    res.setHeader('Content-Type', cType);
    res.end(JSON.stringify(response_json));
    return false;
}

function coinomat(req, res, next): boolean {
    const url = parse(req.url) as any;
    if (!url.href.includes('/coinomat/')) {
        next();
        return null;
    }
    let response_json = { error: 'oops' };
    const path = url.pathname.split('/').pop();
    const filename = `./mocks/coinomat/${path}.json`;

    if (fs.existsSync(filename)) {
        response_json = JSON.parse(fs.readFileSync(filename, 'utf8')) || '';
    }

    if (path === 'rate.php') {
        const data = qs.parse(url.query);
        response_json = (data.amount * 0.32258064) as any;
    }

    const cType = 'application/json; charset=utf-8;';
    res.setHeader('Content-Type', cType);
    res.end(JSON.stringify(response_json));
    return false;
}

interface IRequestData {
    platform: TPlatform;
    connection: TConnection;
    build: TBuild;
}
