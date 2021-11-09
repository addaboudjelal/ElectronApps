const { app, BrowserWindow } = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;

console.log(process.platform);

let mainWindow;

function createMainWindow () {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600
    });
    mainWindow.loadFile(`./app/index.html`);
    // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}

app.on('ready', createMainWindow);