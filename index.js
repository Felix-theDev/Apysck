require('dotenv').config();
const http = require('http');
const Websocket = require('ws');
const express = require('express');
const { stringify } = require('querystring');

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
      testMetaApiSynchronization();
 });

 async function testMetaApiSynchronization(){
    

    const wss = new Websocket.Server({ server })
    let initialize;
      try {
        initialize = await new Promise((resolve)=>{
            wss.on('connection', (ws)=>{
             
            console.log('A new client is connected');
            let socket = ws;
            resolve(ws)

            connectUser(socket);
        });
        wss.on('close', (ws)=>{
          console.log('A client has disconnected');
        });


        
        })

    
        
    
      } catch (err) {
        console.error(err);
      }
      // process.exit();
 }

 async function connectUser(socket){
  const account = await api.metatraderAccountApi.getAccount(accountId);
  const initialState = account.state;
  const deployedStates = ['DEPLOYING', 'DEPLOYED'];

  if(!deployedStates.includes(initialState)) {
    // wait until account is deployed and connected to broker
    // console.log('Deploying account');
    await account.deploy();
  }
  // console.log('Waiting for API server to connect to broker (may take couple of minutes)');
  await account.waitConnected();

  // connect to MetaApi API
  let connection = account.getStreamingConnection();
  await connection.connect();

  // wait until terminal state synchronized to the local state
  // console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)');
  await connection.waitSynchronized();

  let terminalState = connection.terminalState;
  // console.log('connected:', terminalState.connected);
 
  terminalState.specification('EURUSD');
  
  await connection.subscribeToMarketData('EURUSD', [
    {type: 'quotes', intervalInMilliseconds: 5000},
    {type: 'candles', timeframe: '1m', intervalInMilliseconds: 10000},
    {type: 'ticks'},
    {type: 'marketDepth', intervalInMilliseconds: 5000}
  ]);
  console.log('Price after subscribe:', connection.terminalState.price('EURUSD'));

  // console.log('[' + (new Date().toISOString()) + '] Synchronized successfully, streaming ' + 'EURUSD' +
  //   ' market data now...');
    let number = 1;
    while(true){
      console.log(`Got here  ${number}`);
      number++;
      await new Promise(res => setTimeout(res, 1000));
      number++
      // console.log(`Got here too ${number}`);
      // console.log('Price now:', connection.terminalState.price('EURUSD'));
      const obj = connection.terminalState.price('EURUSD');
      // console.log('My structure' , obj);

      const json = JSON.stringify(obj);
      socket.send(json);
      
    }
    
     
    if(!deployedStates.includes(initialState)) {
    // undeploy account if it was undeployed
    console.log('Undeploying account');
    await connection.close();
    await account.undeploy();
    
  } 
  

 }