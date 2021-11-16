const path = require('path');
const os = require('os');
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require('electron');
// const imagemin = require('imagemin');
// import imagemin from 'imagemin';
const imageminMoz = require('imagemin-mozjpeg');
const imageminPng = require('imagemin-pngquant');
// const slash = require('slash');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;

const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;

function createMainWindow () {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 900,
        height: 600,
        resizable: isDev,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    if(isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(`./app/index.html`);
    // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}


const menu = [
    ...(isMac ? [{ role: 'appMenu'}] : []),
    {
        role: 'fileMenu'
    },
    /**
     * Same result as role:fileMenu
     * {
        label: 'File',
        submenu: [
            { 
                label: 'Quit',
                accelerator: isMac ? 'Command+W':'Ctrl+W',
                click: () => app.quit()
            }
        ]
    },*/
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload'},
                { role: 'forcereload'},
                { type: 'separator' },
                { role: 'toggledevtools'},
            ]
        }
    ] : [])
]

ipcMain.on('image:minimize', (e, options) => {
    options.dest = path.join(os.homedir(), 'imageshrink');
    console.log('Received: ', options);
    shrinkImage(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
    try {
        const slash = ( await import('slash')).default;
        const imagemin = ( await import('imagemin')).default;
        const pngQuality = quality/100;
        const files = await imagemin([slash(imgPath)],{
            destination: dest,
            plugins: [imageminPng({ quality: [pngQuality,pngQuality] }), imageminMoz({ quality})]
        });
        console.log('Files:\n', files);
        shell.openPath(dest);
    } catch (error) {
        console.log('Error Loading Image: \n', error);
    }
}


app.on('ready', () => {
    createMainWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    // globalShortcut.register('CmdOrCtrl+Alt+I', () => mainWindow.toggleDevTools())

    mainWindow.on('closed', () => mainWindow = null);
});
app.on('active', () => {
    if( BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
app.on('window-all-closed', () => {
    !isMac && app.quit();
});
