
import got from 'got';
import {SecurityDto} from '../trots';

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
  series: alphavantageSecurityDto;
  security = () => got.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
    .json<any>()
    .then(res => { return (Object.entries(res["Time Series (Daily)"]).map((x:[string,period]) => ({
      close: parseFloat(x[1]["4. close"]),
      open: parseFloat(x[1]["1. open"]),
      high: parseFloat(x[1]["2. high"]),
      low: parseFloat(x[1]["3. low"]),
      time: new Date(x[0])
    }) ).sort((a,b) =>
      a.time.getTime() - b.time.getTime()
    ))
  
  });
}

export default new SecurityEndpoint();
