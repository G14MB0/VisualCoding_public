const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

ipcMain.handle('quit-app', () => {
  app.quit();
});

ipcMain.handle('minimize-app', () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-app', () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

require("@electron/remote/main").initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600, // set minimum width to 400 pixels
    minHeight: 300, // set minimum height to 300 pixels
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, '../preload.js'),
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // win.loadURL(`http://localhost:${process.env.PORT}`)
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

