const { app, BrowserWindow, ipcMain, Menu, MenuItem} = require('electron');
const path = require('path');

var win;

const mainMenuTemplate = [
    { label:'Ficheiro',
		submenu: [               
		   {label:'Configs'},
		   {type:'separator'},
		   {label:'Exit',
				click() {
					app.quit();
				}
			}
		]
	},
    {label:'Opções',
		submenu: [ 
			{role: 'toggledevtools'},
			{label:'Abreviações',
				click() {
					console.log("Mostra Abreviações");
					openAbreviacoesWindow();
				}
			}
		]
	},
    {label:'Sobre',
		submenu: [ 
			{label:'Info',
				click() {
					console.log("Mostra Info");
					openAboutWindow();
				}
			}
		]
	},
 ]; 

function createWindow () {
	win = new BrowserWindow({
	 width: 800,
	 height: 820,
	 webPreferences: {
		webviewTag : true,
		nodeIntegration: true,
		contextIsolation: false,	   
	 }
	})

	win.loadFile('index.html');
	//win.webContents.openDevTools();	
}
 
 //preload: path.join(__dirname, 'index.js')

 //Configura MENU
 const menu = Menu.buildFromTemplate(mainMenuTemplate);
 Menu.setApplicationMenu(menu);
 
 app.whenReady().then(createWindow)

 app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
     app.quit()
   }
 })

 app.on('activate', () => {
	 
	if (BrowserWindow.getAllWindows().length === 0) {
	 createWindow()
	}   
 })
 
 ipcMain.on('invokeAction', (event, data) => {
		//var result = "result!";
		//event.sender.send('actionReply', result);
		console.log("IPC: (" + data.nome + ") -> " + data.msg );
		win.webContents.send('mainprocess-response', data);		
 });
 
 var aboutWindow = null;
 function openAboutWindow() {
  if (aboutWindow) {
    aboutWindow.focus()
    return
  }

  aboutWindow = new BrowserWindow({
    width:  660,
	height: 650,
    resizable: false,
    title: 'DeepBotChat Info',
    minimizable: false,
    fullscreenable: false
  });
  
  aboutWindow.removeMenu();
  //aboutWindow.openDevTools();

  aboutWindow.loadURL('file://' + __dirname + '/views/about.html');

  aboutWindow.on('closed', function() {
    aboutWindow = null;
  });
}

var abreviacoesWindow = null;
 function openAbreviacoesWindow() {
  if (abreviacoesWindow) {
    abreviacoesWindow.focus()
    return
  }

  abreviacoesWindow = new BrowserWindow({
    height: 640,
    resizable: true,
    width: 512,
    title: 'DeepBotChat - Configura Abreviações',
    minimizable: false,
    fullscreenable: false
  });
  
  abreviacoesWindow.removeMenu();
  
  //abreviacoesWindow.openDevTools();

  abreviacoesWindow.loadURL('file://' + __dirname + '/views/abreviacoes.html');

  abreviacoesWindow.on('closed', function() {
    abreviacoesWindow = null;
  });
}