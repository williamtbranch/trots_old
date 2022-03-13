import got from 'got';
import {SecurityDto} from '../trots';
import { LayoutOptions } from 'lightweight-charts';

interface period {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

interface timeSeries {
  [date: string]: period;
}

interface metaData {
  "1. Information": string;
  "2. Symbol": string;
  "3. Last Refreshed": string;
  "4. Output Size": string;
  "5. Time Zone": string;
}

interface  alphavantageSecurityDto {
  "Meta Data": metaData;
  "Time Series (Daily)"?: timeSeries;
}

class SecurityEndpoint {
  key?: string;
  series: alphavantageSecurityDto;
  alpha?: any;
  options: any;

  setKey = (key: string) => {
    this.key = key;
    this.options = {
      headers: {
        'Authorization' : key
      }
    }
  }

  AVsecurity = (symbol: string) => 
    got.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.key ?? 'demo'}`)
      .json<any>()
      .then(res => {
        if(res["Time Series (Daily)"] === undefined) {
          return [];
        }
        return (Object.entries(res["Time Series (Daily)"])
          .map((x:[string,period]) => ({
            close: parseFloat(x[1]["4. close"]),
            open: parseFloat(x[1]["1. open"]),
            high: parseFloat(x[1]["2. high"]),
            low: parseFloat(x[1]["3. low"]),
            time: new Date(x[0])
          })).sort((a,b) =>
            a.time.getTime() - b.time.getTime()
          ))
      }).catch((error) => console.log(error));

  // security = (symbol: string) => this.alpha.data.daily_adjusted("symbol");
  // security = (symbol: string) => got.get(`https://api.tradestation.com/v3/marketdata/barcharts/${symbol}`, this.options)
}

export default new SecurityEndpoint();
