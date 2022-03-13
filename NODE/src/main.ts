import { app, BrowserWindow, globalShortcut } from "electron";
import * as path from "path";
import { PlaceMenu } from "./ui";
//import {SecurityDto, Trots} from "./trots";
import {ipcMain} from "electron";
import CatFactEndpoint from "./services/CatFactEndpoint"
import {Tick} from "./trots"
import {Config} from "./config";
import { getAccessCode, getTokens, TradeStationTokens, getQuote, getAuthUrl, getDaysBack } from "./services/TradestationService";

const ipc = ipcMain;
let mainWindow: BrowserWindow;
const config = new Config();

async function tradestationAuth(key: string, secret: string) {
  mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 1000,
  });

  getAuthUrl(key).then((url) => mainWindow.loadURL(url))
  const code = await getAccessCode;
  const tokens = await getTokens(key, secret, code) as TradeStationTokens;
  const data = await getDaysBack( tokens.accessToken, "SPY", "Daily", 500)

  setTimeout(
    () => mainWindow.webContents.send('security:graph', data),
    1000
  )

  // VERY IMPORTANT!!! the code won't compile without these lines
  CatFactEndpoint.catfact().then((fact: string) => 
    mainWindow.webContents.send('catfact', data)
  )

  mainWindow.loadFile(path.join(__dirname, "../index.html"))

  globalShortcut.register('Control+Shift+I', () => {
    mainWindow.webContents.isDevToolsOpened() ? 
      mainWindow.webContents.closeDevTools() :
      mainWindow.webContents.openDevTools();
  })
}

app.on("ready", () => {
  config.load(() => {
    //console.log("tradestation key:", config.tradeStationKey)
    tradestationAuth(config.tradeStationKey, config.tradeStationSecret);
    PlaceMenu(mainWindow); 
  });
  //let trots = new Trots;

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) tradestationAuth(config.tradeStationKey, config.tradeStationSecret);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});