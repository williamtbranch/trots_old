import {app, ipcRenderer} from "electron";
import {createChart} from "./lightweight-charts.standalone.development.js";
import {SecurityDto, Tick} from './trots';



ipcRenderer.on('catfact', (event, catfact: string) => {
  console.log(catfact); 
})


ipcRenderer.on('security:graph', (event, data: any) => {
  const chart = createChart(document.body, {width: 600, height: 400});
  const lineSeries = chart.addLineSeries();
  lineSeries.setData(data.map ((x: any) => ({
    time: (new Date(x.TimeStamp)).toISOString().split("T")[0],
    value: x.Close
  })).sort((a: any,b: any) => 
   a.time < b.time ? 1:0 
  ))})

