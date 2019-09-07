const electron = require('electron');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
let mainWindow;


app.on('ready', function() {
    
    mainWindow = new BrowserWindow({width: 1300, height: 760, webPreferences: {webSecurity: false,plugins:
        true,nodeIntegration: true}});
 
    mainWindow.loadURL('file://' + __dirname + '/view/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null
    });

});