require('dotenv').config();
const http = require('http');
const Websocket = require('ws');
const express = require('express');
const { stringify } = require('querystring');
const { Console } = require('console');

const port = process.env.PORT || 3000;

let MetaApi = require('metaapi.cloud-sdk').default;
let token = process.env.TOKEN || '<eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI3YzFmYmZlMzMxYWJlYWJlZDFmYmE2NGRjOTA4OWRiYyIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7Im1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJtZXRob2RzIjpbIm1ldGFhcGktYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTp3czpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7Im1ldGhvZHMiOlsibWV0YXN0YXRzLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsibWV0aG9kcyI6WyJyaXNrLW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJtZXRob2RzIjpbImNvcHlmYWN0b3J5LWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsibWV0aG9kcyI6WyJtdC1tYW5hZ2VyLWFwaTpyZXN0OmRlYWxlcjoqOioiLCJtdC1tYW5hZ2VyLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19XSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6IjdjMWZiZmUzMzFhYmVhYmVkMWZiYTY0ZGM5MDg5ZGJjIiwiaWF0IjoxNjgwMjAxNzI4fQ.dKQ5rca8Q4RtAIz-o86QzjZb22f_QiUT_6Yh07mifcUN3kEbCKjZxlALu_X4ROwnyrCl1YXpc7KlhknZbDINKm6k68yo8CC_cc-EhEIPToQq-xKFwVZwdAFSI2wfBXRzhWxJGc4srVMq2PzJfsIl0qLHcB1hgjCbFOGZjbNmELrkEgFPXbxRthDFSoq-nMYszA4Gb5vjOUGnBh-mY5cVm0GkInlWvRNMECjWvsk7NaPlNu7SwcFTfzu_X_nsrAHQPd7ulp7tw0IbCA9PHZtVE9oZ8v4UAsdthaVmYp29nPOrV4FKzxXWMfG8c8O6NuHkLcpnebhp7KnumERoiqDmT_CfjgSlkbqnilw1IQozYTwHo8sNlVtHiK70w0U7qW-b-4DlxQnTnsmdeLqxJLkTaRZN-6qVSpABLIhhOYukhBtSr8UbuQnOpBb9pux8ySBMobQIWuV68YM5FYcsrC5KKWqRJcKGntQ75sq8r1c_rJmMxKIQm9vrr41AHm803EJ4zbJZdyJ8Kh90pEoh-qGv-BMJlMt7HLNIE_c32d-VNIaVmiuG6xcPmztA5Z1L2qtTQJsw9ZpzBc6knkR7ft_VkyZqRiKavodvyEKEBVSi82eqrDYh3MK558-vNnmKQb7AswzbwnZUwrnpe5ULEYSo-m9_0znBYOef8pWVh8uC5Kc>';
let accountId = process.env.ACCOUNT_ID || '<d8b6a13e-e57e-409c-a1fd-6512a305d164>';
const api = new MetaApi(token);


const server = http.createServer((req, res) => {
  // Handle incoming HTTP requests
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('jello');
  //   synchronizationExample.testMetaApiSynchronization();
  res.write('I\'m back');
  res.end();
});

server.listen(port, () => {
  console.log('Server listening on http://localhost:3000');
  console.log('Server listening on http://localhost:3000');
  testMetaApiSynchronization();
});

async function testMetaApiSynchronization() {


  const wss = new Websocket.Server({ server })
  let initialize;
  try {
    initialize = await new Promise((resolve) => {
      wss.on('connection', (ws) => {

        console.log('A new client is connected');
        let socket = ws;
        resolve(ws)
        let account;
        ws.on('message', async (data) => {
          console.log(data);
          const message = JSON.parse(data);
          if (message.type === 'login') {
            account = await connectAccountToMetaApi(socket, message.login);
          }
          else if (message.type === 'accountId') {
            account = await connectAccountToMetaApi(socket, message.accountId)
          } 
          else if(message.type === 'stream'){
              if(account != null){
                let currency = message.currency;
                console.log(currency)
                  streamPriceData(socket, account, currency);

              }else{
                Console.log('No stream account provided');
              }
          }else if(message.type === 'deploy'){
            if(account != null){
                deployAccount(socket, account);
            }
          }else if (message.type === 'undeploy'){
            if(account != null){
              undeployAccount(socket, account)
            }
          }
          else if(message.type === 'state'){
            getConnectionState(account)
          }
          else {
            console.log('No login or account Id provided')
          }

        });
        ws.on('close', ()=>{
          console.log('A client has disconnected')
        })
      });
      // 
      


    })


  } catch (err) {
    console.error(err);
  }
  // process.exit();
}

async function deployAccount(socket, account) {

 
  const initialState = account.state;
  console.log(`Initial state is ${account.state}`);
  const deployedStates = ['DEPLOYING', 'DEPLOYED'];

  if (!deployedStates.includes(initialState)) {
    // wait until account is deployed and connected to broker
    console.log('Deploying account');
    await account.deploy();
    console.log('Account deployed');
    socket.send("Account Deployed")

  }
  console.log('Waiting for API server to connect to broker (may take couple of minutes)');
  await account.waitConnected();
  console.log('Account connected to broker')


  console.log(`Current state is ${account.state}`);

}

async function getConnectionState(account){

  console.log(`Current state is ${account.state}`);
}



async function streamPriceData(socket, account, currency){
  const initialState = account.state;
  const deployedStates = ['DEPLOYING', 'DEPLOYED'];

  // if (!deployedStates.includes(initialState)) {
  //   // wait until account is deployed and connected to broker
  //   // console.log('Deploying account');
  //   await account.deploy();
  // }
  let continueStream = false;
  if(deployedStates.includes(initialState)){
      continueStream = true;

    
  

    await account.waitConnected();

    // connect to MetaApi API
    let connection = account.getStreamingConnection();
    await connection.connect();

    // wait until terminal state synchronized to the local state
    // console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)');
    await connection.waitSynchronized();

    let terminalState = connection.terminalState;

    terminalState.specification(currency);

    await connection.subscribeToMarketData(currency, [
      { type: 'quotes', intervalInMilliseconds: 5000 },
      { type: 'candles', timeframe: '1m', intervalInMilliseconds: 10000 },
      { type: 'ticks' },
      { type: 'marketDepth', intervalInMilliseconds: 5000 }
    ]);
    console.log('Price after subscribe:', connection.terminalState.price(currency));

    // console.log('[' + (new Date().toISOString()) + '] Synchronized successfully, streaming ' + 'EURUSD' +
    //   ' market data now...');
    let number = 1;
    while (continueStream && deployedStates.includes(account.state)) {
      console.log(`Got here  ${number}`);
      number++;
      await new Promise(res => setTimeout(res, 1000));
      number++
      const obj = connection.terminalState.price(currency);
      
      const json = JSON.stringify(obj);
      console.log(`Symbol is ${obj.symbol}`);
      console.log(`Bid price is ${obj.bid}`);
      console.log(`Ask price is ${obj.ask}`);
      socket.send(json);

      
    socket.on('close', (ws) => {
      console.log('Streaming ended');
      continueStream = false;
    });
    
    

  }

}else{
  console.log("Account is not deployed, can't stream");
}

}

async function undeployAccount(socket, account){
  const initialState = account.state;
  const deployedStates = ['DEPLOYING', 'DEPLOYED'];

  if (!deployedStates.includes(initialState)) {

    // undeploy account if it was undeployed
    console.log('Undeploying account');
    // await connection.close();
    await account.undeploy();

    console.log('Account undeployed');
    socket.send("Account Undeployed")


  }

  else{
      await account.undeploy();
      console.log('Account undeployed');
  }

}

async function connectAccountToMetaApi(socket, login) {
  try {
    let accounts = await api.metatraderAccountApi.getAccounts();
    let account = accounts.find(a => a.login === login && a.type.startsWith('cloud'));
    if (!account) {
      console.log('Adding MT5 account to MetaApi');
      account = await api.metatraderAccountApi.createAccount({
        name: 'Test account',
        type: 'cloud',
        login: login,
        password: password,
        server: serverName,
        platform: 'mt5',
        magic: 1000
      });
      socket.send("Account has been added to Metaapi");
      return account;
    } else {
      console.log('MT5 account already added to MetaApi');
      account = await api.metatraderAccountApi.getAccount(accountId);
      console.log("gotten account info");
    //  NEXT LINE NEEDED FOR DEBUGGING PURPOSE
      // console.log(account);
      socket.send("Account already exist on Metaapi server");
      return account;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }

//Implement a function to stop streaming without undeploying
async function stopStreaming()

  //set continue streaming to false
}