'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.


var bb8 = require('./bb8.js');
var droid = new bb8('01109d10cbbd468081ea2a8845fc3512');


var ipc = require('electron').ipcMain;;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();


var update = function () {

  setTimeout(function() {
    droid.update();
    update();
  }, 100)

}


droid.start(function() {
  console.log("connected to bb8");  

  update();

});

  ipc.on('keydown', function (event, key) {
    console.log("keydown: " + key);

    switch (key) {
      case 87:
        droid.moveUp();
        break;
      case 83:
        droid.moveDown();
        break;
      case 65:
        droid.rotateLeft();
        break;
      case 68:
        droid.rotateRight();
        break;
      case 32:
        droid.brake();
        break;
      case 16:
        droid.startCalibration();
        break;  
      case 27:
        droid.stop(function() {
          console.log("stop");
          process.exit();
        });
        break;
      default:
        break;           
    }

  });

   ipc.on('keyup', function (event, key) {
    console.log("keyup: " + key);

      switch (key) {
        case 87:
          droid.stopMoveUp();
          break;
        case 83:
          droid.stopMoveDown();
          break;
        case 65:
          droid.stopRotateLeft();
          break;
        case 68:
          droid.stopRotateRight();
          break;
        case 16:
          droid.stopCalibration();
          break;  
        default:
          break;           
      }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
