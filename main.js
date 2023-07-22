const {app, BrowserWindow, ipcMain, Menu, globalShortcut, shell} = require('electron');
//require('dotenv').config()
const path = require('path');
const os = require('os');
const fs = require('fs');
const { create } = require('domain');
let destination = path.join(os.homedir(), 'audios')

const isDev = process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development"  ? true : false ;

const isWin32 = process.platform === 'win32' ? true : false ;
const isMac = process.platform === 'darwin' ? true : false ;

function createPreferenceWindow(){
    const preferenceWindow = new BrowserWindow({
        width: isDev ? 900 : 500,
        resizable: isWin32 ? true : false,
        height: 150,
        backgroundColor: '#234',
        show: false,
        icon: path.join(__dirname, 'assets', 'icons'),
        webPreferences: { 
            nodeIntegration: true, //permite usar ipcRenderer em script.js
            contextIsolation: false,
        },
    });

    preferenceWindow.loadFile('./src/preferences/index.html')

    preferenceWindow.once('ready-to-show', ()=>{
        preferenceWindow.show()
        if(isDev){
            preferenceWindow.webContents.openDevTools();
        }
    })
}

function createWindow(){
    const win = new BrowserWindow({
        width: isDev ? 900 : 700,
        resizable: isWin32 ? true : false,
        height: 600,
        backgroundColor: '#234',
        show: false,
        icon: path.join(__dirname, 'assets', 'icons'),
        webPreferences: { 
            nodeIntegration: true, //permite usar ipcRenderer em script.js
            contextIsolation: false,
        },
    });

    win.loadFile('./src/mainWindow/index.html');
    
    isDev ? win.webContents.openDevTools() : console.log('not windows');

    win.once('ready-to-show',()=>{
        win.show();
        setTimeout(()=>{
            win.webContents.send('cpu_info', os.cpus()[0].model)
        }, 3000)
        
    })

    // Read documentation to see all roles. 
    const menuTemplate =[
        { label: app.name, // por padrão ele vem com o nome, mas mesmo assim coloquei só pra saber.
            submenu: [
                {label: 'preferences', click: () => { createPreferenceWindow()}},
                {label: 'Open destination folder', click: () => {shell.openPath(destination)}}
            ]
        },
        { 
            label: 'File',
            submenu: [ isMac ? { role: 'close'} : { role: 'quit'} ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'New Window',
                    click: ()=> {createWindow() }
                },
                {
                    type: 'separator'
                },
                { 
                    label : 'Close all windows',
                    accelerator: isMac ? 'Cmd+b': 'Ctrl+b',
                    click: ()=>{
                        //BrowserWindow.getAllWindows().forEach(window =>{window.close()}),
                        console.log("Atalho ativado")
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(()=>{
    createWindow();
});

app.on('will-quit',()=>{
    globalShortcut.unregisterAll()
})

// app.on('window-all-closed', ()=>{
//     console.log("Todas as janelas fechadas")
//     app.quit();
// })

// app.on("activate", ()=>{
//     if(BrowserWindow.getAllWindows().length === 0){
//         createWindow();
//     }
// })

ipcMain.on('open_new_window', ()=>{
    createWindow();
})

ipcMain.on('save_buffer', (e, buffer)=>{
    const filePath = path.join(destination, `${Date.now()}`)
    fs.writeFileSync(`${filePath}.webm`, buffer) // buffer é o que vai ser colocar no file
})