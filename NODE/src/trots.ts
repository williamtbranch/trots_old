export class Trots {
  data: string = "Trots: No Data.";
}
interface Tick {
  close: number,
  open: number,
  high: number,
  low: number,
  time: Date
}

export interface SecurityDto {
  name: string,
  data: Tick[]
}

class SecurityEndpoint {
  //get = (stock: string, begin: DateTime, end: DateTime) => 
      // code to grab stock data and format it if needed

  //load = (stock: string) =>
      // load from the file system

  //save = (stock: StockDto) =>
      // save the stock to the file system
}