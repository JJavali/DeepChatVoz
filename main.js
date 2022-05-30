const { app, BrowserWindow, ipcMain, Menu, MenuItem} = require('electron');
const path = require('path');

var win;

const mainMenuTemplate = [
    { label:'Ficheiro',
		submenu: [               
		    {label:'Registo Mensagens',
				click() {
					console.log("Mostra Mensagens");
					openNewWindow("mensagens","Registo Mensagens", 680, 620);
				}
			},
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
			{role: 'reload' },
			{label:'Abreviações',
				click() {
					console.log("Mostra Abreviações");					
					openNewWindow("abreviacoes","DeepBotChat - Configura Abreviações", 640, 512);
				}
			}
		]
	},
    {label:'Sobre',
		submenu: [ 
			{label:'Info',
				click() {
					console.log("Mostra Info");					
					openNewWindow("about","DeepBotChat Info", 660, 650);
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
 
 var dicFalas = [];
 
 ipcMain.on('getFalas', (event, data) => {
		//var result = "result!";
		event.sender.send('getFalasReply', dicFalas);
		console.log("IPC: (GET FALAS)");
 });
 
 ipcMain.on('invokeAction', (event, data) => {
		//var result = "result!";
		//event.sender.send('actionReply', result);
		console.log("IPC: (" + data.nome + ") -> " + data.msg );
		win.webContents.send('mainprocess-response', data);
		
		//armazena fala:
		if (dicFalas[data.nome] == undefined) dicFalas[data.nome] = new Array();
		dicFalas[data.nome].push(data.msg);
		
		//console.table(dicFalas);
 });
 
 
 var m_OpenWindow = null;
 function openNewWindow(file,strTitle, wid, hei) {
  if (m_OpenWindow) {
    m_OpenWindow.focus()
    return
  }

  m_OpenWindow = new BrowserWindow({
    width:  wid,
	height: hei,
    resizable: false,
    title: strTitle,
    minimizable: false,
    fullscreenable: false,
	webPreferences: {
		nodeIntegration: true,
		contextIsolation: false
	 }
  });
  
  m_OpenWindow.removeMenu();
  //m_OpenWindow.openDevTools();

  m_OpenWindow.loadURL('file://' + __dirname + '/views/' + file + '.html');

  m_OpenWindow.on('closed', function() {
    m_OpenWindow = null;
  });
}