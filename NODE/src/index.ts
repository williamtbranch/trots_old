import {app, ipcRenderer} from "electron";
import SecurityEndpoints from "./services/SecurityEndpoints";
import {createChart} from "./lightweight-charts.standalone.development.js";
import {SecurityDto, Tick} from './trots';


ipcRenderer.on('security:send', (event, arg) => {
  console.log("Got security from main process.");
  const myData: HTMLElement | null = document.getElementById("data")!;
  myData.innerHTML = arg;
  return true;
});

ipcRenderer.on('catfact', (event, catfact: string) => {
  console.log(catfact); 
})

ipcRenderer.on('quote:get', (event, quote: any) => {
  console.log(quote); 
})

ipcRenderer.on('security:get', (event, series: any) => {
  console.log("SPY data:", series);
  // const chart = createChart(document.body, {width: 600, height: 400});
  // console.log (series);
  // const lineSeries = chart.addLineSeries();
  // lineSeries.setData(series.map (x => ({
  //   time: x.time.toISOString().split("T")[0],
  //   value: x.close
  // })).sort((a,b) => 
  //  a.time < b.time ? 1:0 
  // ))
});

ipcRenderer.on('tradestation:key', (event, key: string) => {
  console.log("tradestation key is", key)
});