
import got from 'got';

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

export interface  securityDto {
  "Meta Data": metaData;
  "Time Series (Daily)"?: timeSeries;
}

class SecurityEndpoint {
  series: securityDto;
  security = () => got.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
    .json<securityDto>()
    .then(res => { return res });
}

export default new SecurityEndpoint();
