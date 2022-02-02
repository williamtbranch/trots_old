import { app, BrowserWindow } from "electron";
import * as path from "path";
import { PlaceMenu } from "./ui";
//import {SecurityDto, Trots} from "./trots";
import {ipcMain} from "electron";
import CatFactEndpoint from "./services/CatFactEndpoint"
import SecurityEndpoints, { securityDto } from "./services/SecurityEndpoints";

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

  mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();
  PlaceMenu(mainWindow); 
  //let trots = new Trots;

  CatFactEndpoint.catfact().then((fact: string) => 
    mainWindow.webContents.send('catfact', fact)
  )
  SecurityEndpoints.security().then((value: securityDto) => 
    mainWindow.webContents.send('security:get', value)
  )

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