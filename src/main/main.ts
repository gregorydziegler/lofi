import { app, BrowserWindow, ipcMain, screen } from 'electron';
import startAuthServer from './server';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 200,
        width: 200,
        frame: false,
        resizable: false,
        maximizable: false
    });

    mainWindow.setAlwaysOnTop(true, "floating", 1);
    // allows the window to show over a fullscreen window
    mainWindow.setVisibleOnAllWorkspaces(true);

    // and load the index.html of the app.
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    ipcMain.on('windowMoving', (e: Event, { mouseX, mouseY }: { mouseX: number, mouseY: number }) => {
      const { x, y } = screen.getCursorScreenPoint();

      // use setBounds instead of setPosition
      // See: https://github.com/electron/electron/issues/9477#issuecomment-406833003
      mainWindow.setBounds({
          width: 200,
          height: 200,
          x: x - mouseX,
          y: y - mouseY
        });
    });
    
    ipcMain.on('windowMoved', () => {
      // Do somehting when dragging stop
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  startAuthServer();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
