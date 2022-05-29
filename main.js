const { app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

var win;

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
	//win.webContents.openDevTools()
}
 
 //preload: path.join(__dirname, 'index.js')

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