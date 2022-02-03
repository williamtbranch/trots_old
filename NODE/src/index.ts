import {ipcRenderer} from "electron";
import SecurityEndpoints, { securityDto } from "./services/SecurityEndpoints";
import {createChart} from "./lightweight-charts.standalone.development.js";


ipcRenderer.on('security:send', (event, arg) => {
  console.log("Got security from main process.");
  const myData: HTMLElement | null = document.getElementById("data")!;
  myData.innerHTML = arg;
  return true;
});

ipcRenderer.on('catfact', (event, catfact: string) => {
  console.log(catfact); 
})

ipcRenderer.on('security:get', (event, series: securityDto) => {
  const chart = createChart(document.body, {width: 400, height: 300});
  const lineSeries = chart.addLineSeries();
  lineSeries.setData([
    {time: '2019-04-11', value: 80.01},
    { time: '2019-04-12', value: 96.63}
  ]);
})