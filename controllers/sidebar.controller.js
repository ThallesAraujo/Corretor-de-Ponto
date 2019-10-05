const BrowserWindow = require('electron').remote.BrowserWindow;

showSidebar = () => {
    document.getElementById('sidebar').classList.remove('hide-sidebar');
    document.getElementById('sidebar').classList.add('show-sidebar');
}

hideSidebar = () => {
    document.getElementById('sidebar').classList.add('hide-sidebar');
    document.getElementById('sidebar').classList.remove('show-sidebar');
}

abrirPortalHoras = () => {
    let win = new BrowserWindow({ width: 1500, height: 800 })
    win.loadURL('http://portalhoras.stefanini.com/');

    let contents = win.webContents;
    console.log(contents)
    win.show();
}

abrirOutlook = () => {
    let win = new BrowserWindow({ width: 1500, height: 800 })
    win.loadURL('https://outlook.office.com/mail/inbox');

    let contents = win.webContents;
    console.log(contents)
    win.show();
}