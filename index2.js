// require('dotenv').config();
// const http = require('http');
// const Websocket = require('ws');
// const express = require('express');
// const { stringify } = require('querystring');

// const port = process.env.PORT || 3000;
// const token = process.env.TOKEN || '<insert your token here>';

// const MetaApi = require('metaapi.cloud-sdk').default;
// const metaApi = new MetaApi(token, {requestTimeout: 60000});

// const app = express();

// async function connectToMarket() {
//   try {
//     await metaApi.connect();
//     console.log('MetaApi connected.');
//     const profiles = await metaApi.provisioningProfileApi.getProvisioningProfiles();
//     console.log(`Available profiles: ${JSON.stringify(profiles)}`);
//   } catch (err) {
//     console.error('Failed to connect to MetaApi', err);
//     process.exit();
//   }
// }

// async function subscribeToMarketData() {
//   const account = await metaApi.metatraderAccountApi.getAccount('50366136');
//   const symbols = await metaApi.metatraderMarketDataApi.getSymbols('50366136');
//   console.log(`Account: ${JSON.stringify(account)}`);
//   console.log(`Symbols: ${JSON.stringify(symbols)}`);
//   const subscription = {
//     symbol: 'EURUSD',
//     interval: '1m'
//   };
//   const onTick = (tick) => {
//     console.log(`EURUSD tick: ${JSON.stringify(tick)}`);
//   };
//   const subscriptionId = await metaApi.metatraderMarketDataApi.subscribeToMarketData(account.id, subscription, onTick);
//   console.log(`Subscription ID: ${subscriptionId}`);
// }

// async function undeployApplication() {
//   await metaApi.metatraderAccountApi.undeployExpert('50366136', 'Test');
//   console.log('Expert undeployed.');
//   process.exit();
// }

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// http.createServer(app).listen(port, () => {
//   console.log(`HTTP server running on port ${port}`);
// });

// connectToMarket();
// subscribeToMarketData();
// undeployApplication();
