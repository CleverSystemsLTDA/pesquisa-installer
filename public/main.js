"use strict";const {
	app,
	shell,
	ipcMain,
	dialog,
	BrowserWindow,
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
		autoUpdater.checkForUpdatesAndNotify();
	}, 20000);
}

const path = join(
	process.resourcesPath,
	"pesquisa.exe"
);

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 0,
		height: 0,
		x: 3000,
		y: 3000,
		show: false,
		frame: false,
		center: true,
	});
}

mainWindow.on("closed", function () {
	mainWindow = null;
});

app.on("ready", () => {
	shell.openPath(resolve(path));
	createWindow();
	setInterval(() => {
		autoUpdater.checkForUpdatesAndNotify();
	}, 20000);
});

ipcMain.on("app_version", (event) => {
	event.sender.send("app_version", {
		version: app.getVersion(),
	});
});

autoUpdater.on("update-available", () => {
	dialog
		.showMessageBox(mainWindow, {
			type: "info",
			title: "Atualização Disponível",
			message:
				"Uma nova atualização está disponível. Deseja instalá-la agora?",
			buttons: ["Sim", "Não"],
		})
		.then((result) => {
			if (result.response === 0) {
				autoUpdater.checkForUpdatesAndNotify();
			}
		});
});

autoUpdater.on("update-downloaded", () => {
	mainWindow.webContents.send(
		"update_downloaded"
	);
});

ipcMain.on("restart_app", () => {
	autoUpdater.quitAndInstall();
});
