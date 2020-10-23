const {app, BrowserWindow} =  require("electron");
const path = require('path');


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minWidth:500,
    autoHideMenuBar:true,
    //frame:false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'app/index.html'));
};


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});