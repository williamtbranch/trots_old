import got from 'got';
import publicIp from 'public-ip';
import { promisify } from 'node:util';
import { Writable } from 'stream';
import stream from 'node:stream';

//const tradeStationURL =  "https://api.tradestation.com/v2";
const tradeStationURL =  "https://sim-api.tradestation.com/v2";

let localPublicIP: string;

type tokenResponse = {
  "refresh_token": string,
  "expires_in": number,
  "access_token": string,
  "token_type": string,
  "userid": string 
}

export type TradeStationTokens = {
  clientId: string,
  clientSecret: string,
  accessToken: string,
  userId: string,
  refreshToken: string,
  expirationDate: number
}

export const getAuthUrl = (key: string) => {
  return publicIp.v4().then(ip => {
    localPublicIP = ip;
    return `${tradeStationURL}/authorize/?redirect_uri=http://${ip}:8080&client_id=${key}&response_type=code`
  });
}

export const getTokens = 
  (clientId: string, clientSecret: string, accessCode: string ) => 
    //console.log("Public IP is: ", publicIp.v4());
    got.post(`${tradeStationURL}/Security/Authorize`, {
      form: {
        "grant_type": "authorization_code",
        "client_id": clientId,
        "client_secret": clientSecret,
        "code": accessCode,
        "redirect_uri": `http://${localPublicIP}:8080`
      }
    }).json<tokenResponse>().then(res => ({
      clientId: clientId,
      clientSecret: clientSecret,
      accessToken: res["access_token"],
      userId: res["userid"],
      refreshToken: res["refresh_token"],
      expirationDate: Date.now() + (res["expires_in"] - 1) * 1000
    })).catch(error => console.log(error))
  

export const getAccessCode = 
  new Promise<string>((resolve, reject) => {
    const express = require("express");
    const e = express();
    const server = e.listen(8080, () => {
      console.log(`server started`);
    });

    e.get("/", (req: any, res: any) => {
      if(req.query.code) {
        server.close();
        resolve(req.query.code);
      }
    });
  })

export const updateToken = (tokens: TradeStationTokens) =>
  got.post(`${tradeStationURL}/Security/Authorize`, {
    form: {
      "grant_type": "refresh_token",
      "client_id": tokens.clientId,
      "redirect_uri": `http://${localPublicIP}`,
      "client_secret": tokens.clientSecret,
      "refresh_token": tokens.refreshToken,
      "response_type": "token"
    }
  }).json<tokenResponse>().then(res => ({
    clientId: tokens.clientId,
    clientSecret: tokens.clientSecret,
    accessToken: res["access_token"],
    userId: res["userid"],
    refreshToken: tokens.refreshToken,
    expirationDate: Date.now() + (res["expires_in"] - 1) * 1000
  })).catch(error => console.log(error))

export const getQuote = (symbol: string, bearer: string) =>
  got.get(`${tradeStationURL}/data/quote/${symbol}`, {
    headers: {
      'Authorization': `Bearer ${bearer}`
    }
  }).json()

export const getDaysBack  = async (bearer: string, symbol: string, unit: "Minute"|"Daily"|"Weekly"|"Monthly", daysBack: number ) => {

  const pipeline = promisify(stream.pipeline);
  
  const isoDate = (new Date()).toISOString().split('T')[0].split('-');
  const currentDate = `${isoDate[1]}-${isoDate[2]}-${isoDate[0]}`;

  let body: string = "";
  const writable = new Writable();
  writable._write = function(chunk, encoding, next) {
    body += chunk.toString();
    next();
  }

  const tStream = got.stream(`${tradeStationURL}/stream/barchart/${symbol}/1/${unit}?daysBack=${daysBack}&lastDate=${currentDate}`, { 
    headers: {
      'Authorization': `Bearer ${bearer}`,
      'Accept': 'application/vnd.tradesation.streams+json'
    }
  });

  tStream.on("error", (error) => console.log(error));

  await pipeline ( tStream, writable );

  return JSON.parse(`[${[...body.matchAll(/{[^}]*}/g)].join(",")}]`)
    .map((x: any) => ({
      ...x,
      TimeStamp: +x.TimeStamp.match(/\d+/)[0]
    }));
}