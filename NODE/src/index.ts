import {ipcRenderer} from "electron";
import SecurityEndpoints, { securityDto } from "./services/SecurityEndpoints";

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
  console.log(series); 
})