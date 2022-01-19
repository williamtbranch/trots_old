const { app, BrowserWindow, Menu } = require('electron')
const createWindow = () => {
        const win = new BrowserWindow({
          width: 800,
          height: 600
        })
      
        win.loadFile('index.html')
      }

      const menu = Menu.buildFromTemplate([
              {
                      label: 'File',
                      submenu: [
                              {label:'Open'},
                              {label: 'Exit'}
                      ]
              }
      ])
      Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
createWindow();
})

app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
      })

const getFileFromUser = () => {
  const files = dialog.showOpenDialog({
    properties: ['openFile']
  });

  if (!files) { return; }

  console.log(files);
};