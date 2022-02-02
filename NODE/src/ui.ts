import {app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions} from "electron";
import { readFileSync } from 'fs';

export function PlaceMenu(window: BrowserWindow): void {
  const template : MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click() {
            dialog.showOpenDialog(
              { properties : ['openFile']
            }).then(result => {
              console.log(result.canceled)
              console.log(result.filePaths)
              let fs = readFileSync(result.filePaths[0], 'utf8')
              window.webContents.send('security:send', fs);
              // console.log(fs);
            }).catch(err => {
              console.log(err)
            })
            console.log("reading file");

          }
        },
        {
          label: 'Quit',
          click() {
            app.quit();
          }
        }
      ]
    }
  ];
  console.log("placing menu");
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
