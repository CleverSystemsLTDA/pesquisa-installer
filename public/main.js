"use strict";
const {
	app,
	// BrowserWindow,
	shell,
	ipcMain,
} = require("electron");
const {
	autoUpdater,
} = require("electron-updater");
const { resolve, join } = require("path");

let mainWindow;

if (process.env.NODE_ENV === "development") {
	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = false;
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 20000);
}

const path = join(
	process.resourcesPath,
	"pesquisa.exe"
);

// function createWindow() {
// mainWindow = new BrowserWindow({
// 	width: 800,
// 	height: 600,
// 	webPreferences: {
// 		nodeIntegration: true,
// 	},
// });
// mainWindow.loadFile("index.html");
// mainWindow.on("closed", function () {
// 	mainWindow = null;
// });

/* app.whenReady().then(() => {
		shell.openPath(resolve(path));
	}); */

// mainWindow.once("ready-to-show", () => {
// 	setInterval(() => {
// 		autoUpdater.checkForUpdatesAndNotify();
// 	}, 20000);
// });
// }

app.on("ready", () => {
	shell.openPath(resolve(path));
	setInterval(() => {
		autoUpdater.checkForUpdatesAndNotify();
	}, 20000);
	// createWindow();
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// app.on("activate", function () {
// 	if (mainWindow === null) {
// 		createWindow();
// 	}
// });

ipcMain.on("app_version", (event) => {
	event.sender.send("app_version", {
		version: app.getVersion(),
	});
});

autoUpdater.on("update-available", () => {
	mainWindow.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
	mainWindow.webContents.send(
		"update_downloaded"
	);
});

ipcMain.on("restart_app", () => {
	autoUpdater.quitAndInstall();
});
