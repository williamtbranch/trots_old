interface Tick {
        price: number,
        time: DateTime
    }
    
    export interface StockDto {
        name: string,
        data: Tick[]
    }
    
    class StockEndpoint {
        get = (stock: string, begin: DateTime, end: DateTime) => 
            // code to grab stock data and format it if needed
    
        load = (stock: string) =>
            // load from the file system
    
        save = (stock: StockDto) =>
            // save the stock to the file system
    }