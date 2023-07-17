const {app, BrowserWindow, ipcMain, Menu, globalShortcut} = require('electron');
//require('dotenv').config()
const path = require('path');
const os = require('os');

const isDev = process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development"  ? true : false ;

const isWin32 = process.platform === 'win32' ? true : false ;
const isMac = process.platform === 'darwin' ? true : false ;

function createWindow(){
    const win = new BrowserWindow({
        width: isDev ? 900 : 500,
        resizable: isWin32 ? true : false,
        height: 300,
        backgroundColor: '#234',
        show: false,
        icon: path.join(__dirname, 'assets', 'icons', 'ak47.png'),
        webPreferences: { 
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('./src/index.html');
    
    isWin32 ? win.webContents.openDevTools() : console.log('not windows');

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
                {label: 'preferences', click: () => {}},
                {label: 'Open destination folder', click: () => {}}
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