import got from 'got';

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

export const getTokens = 
  (clientId: string, clientSecret: string, accessCode: string ) =>
    got.post("https://api.tradestation.com/v2/Security/Authorize", {
      form: {
        "grant_type": "authorization_code",
        "client_id": clientId,
        "client_secret": clientSecret,
        "code": accessCode,
        "redirect_uri": "http://47.186.99.99:8080"
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
    got.post("https://api.tradestation.com/v2/Security/Authorize", {
      form: {
        "grant_type": "refresh_token",
        "client_id": tokens.clientId,
        "redirect_uri": "http://47.186.99.99:8080",
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
    got.get(`https://api.tradestation.com/v2/data/quote/${symbol}`, {
      headers: {
        'Authorization': `Bearer ${bearer}`
      }
    }).json()