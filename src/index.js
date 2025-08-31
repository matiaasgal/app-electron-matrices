const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');

//// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

//! se define la ventana de la app
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  Menu.setApplicationMenu(null);
};

//! se crea la ventana
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


//! aca se maneja la navegacion desde el preload
ipcMain.on('navegar-a-suma', (event) => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'suma.html'));
});
ipcMain.on('navegar-a-multiplicacion', (event) => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'multiplicacion.html'));
});
ipcMain.on('navegar-a-inversa', (event) => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'inversa.html'));
});
ipcMain.on('volver-a-index', (event) => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
});

//! datos traspasados para la logica
let matrizDatos = null;
let multiData = null;
let inversaData = null;

ipcMain.on('navegar-a-llenado-inversa', (e, data) => {
  inversaData = data;
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'llenadoInversa.html')).then(() => {
    mainWindow.webContents.send('inversa-data', inversaData);
  })
})
ipcMain.on('navegar-a-llenado-multi', (e, data) => {
  multiData = data;
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'llenadoMulti.html')).then(() => {
    mainWindow.webContents.send('multi-data', multiData);
  })
})
ipcMain.on('navegar-a-llenado', (e, data) => {
  matrizDatos = data;
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow.loadFile(path.join(__dirname, 'llenadoMatrices.html')).then(() => {
    mainWindow.webContents.send('matriz-datos', matrizDatos);
  });
})
