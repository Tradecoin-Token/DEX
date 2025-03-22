# DEX

DEX is the official wallet software designed with mass adoption in mind. It allows to access your account, handle financial operations, issue tokens, and trade on DEX.

## Changes made to original code due to CORS Issue 

```
File Location: ./data-service/utils/request.ts
options.credentials = 'omit';

File Location: ./src/modules/app/services/User.js
const response = await ds.fetch(`${ds.config.get('node')}/addresses/scriptInfo/${address}`, {credentials: "omit"});

```

## For developers

You will need Node.js 10.7.0 (or higher) and npm v5 (or higher) or most suitable for below.
``` 
node: 18.18.2
npm: 10.9.0
yarn: 1.22.7 (window pc)
```

```
npm i (avoid using npm install)
npm run server (avoid using npm run)
```

The server will be launched at [https://localhost:8080](https://localhost:8080).
