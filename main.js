const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('ready', function() {
    
    mainWindow = new BrowserWindow({width: 1350, height: 760, webPreferences: {webSecurity: false, nodeIntegration: true, nativeWindowOpen: true,
        nodeIntegrationInWorker: true,}});
    //BrowserWindow.getFocusedWindow().webContents.openDevTools()
 
    mainWindow.loadURL('file://' + __dirname + '/view/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null
    });

});