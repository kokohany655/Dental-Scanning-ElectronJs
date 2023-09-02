const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1500,
    height: 1500,
    fullscreenable: true,
    alwaysOnTop: true,
    closable: true,
    maximizable: true,
    resizable:false,
    title: "Medical Tap",
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
