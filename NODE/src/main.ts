import { app, BrowserWindow, globalShortcut } from "electron";
import * as path from "path";
import { PlaceMenu } from "./ui";
//import {SecurityDto, Trots} from "./trots";
import {ipcMain} from "electron";
import CatFactEndpoint from "./services/CatFactEndpoint"
import SecurityEndpoints from "./services/SecurityEndpoints";
import {Tick} from "./trots"
import {Config} from "./config";

const ipc = ipcMain;
let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 1000,
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  globalShortcut.register('Control+Shift+I', () => {
    mainWindow.webContents.isDevToolsOpened() ? 
      mainWindow.webContents.closeDevTools() :
      mainWindow.webContents.openDevTools();
  })

}

app.on("ready", () => {
  createWindow();
  PlaceMenu(mainWindow); 
  //let trots = new Trots;


  CatFactEndpoint.catfact().then((fact: string) => 
    mainWindow.webContents.send('catfact', fact)
  )

  const config = new Config();  
  config.load(() => {
    // console.log("alphavantage key:", config.alphavantageKey)
    console.log("tradestation key:", config.tradeStationKey)
    // SecurityEndpoints.setKey(config.tradeStationKey);
    // SecurityEndpoints.key = config.alphavantageKey;
    // SecurityEndpoints.AVsecurity("SPY").then((value: Tick[]) => 
    //   mainWindow.webContents.send('security:get', value)
    // )
    // SecurityEndpoints.security("SPY").then((data: any) => 
    //   mainWindow.webContents.send('security:get', data)
    // ).catch((error: any) => console.log(error)) ;
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});