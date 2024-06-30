const { app, BrowserWindow, globalShortcut, shell } = require('electron');
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const isDev = require('electron-is-dev');

// RUN SERVER
const createExpressApp = require('../server/server');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    resizable: false,
    frame: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (!isDev) {
    // Serve your React app over HTTP
    const react_app = express();
    const port = 3000; // Port where your React app will be served

    // Serve static files from the React app's build folder
    react_app.use(express.static(path.join(__dirname, 'react')));
    react_app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'react', 'index.html'));
    });
    react_app.listen(port, () => {
      console.log(`React app running on http://localhost:${port}`);
    });
  }

  const startUrl = 'http://localhost:3000/send'
  mainWindow.loadURL(startUrl);

  globalShortcut.register('f5', () => {
    mainWindow.reload();
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

