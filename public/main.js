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
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 10000);
	autoUpdater.autoInstallOnAppQuit = false;
}

const path = join(
	process.resourcesPath,
	"pesquisa.exe"
);

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
}

function showVersion() {
	dialog.showMessageBox(mainWindow, {
		type: "info",
		title: "Versão do App",
		message:
			`A versão do app é ${app.getVersion()}`,
		buttons: ["OK"],
	}).then(async () => {
		await autoUpdater.checkForUpdatesAndNotify();
		shell.openPath(resolve(path));
	});
}

ipcMain.on("app_version", (event) => {
	event.sender.send("app_version", {
		version: app.getVersion(),
	});
});

app.on("ready", () => {
	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = false;
	createWindow();
	showVersion();
});

autoUpdater.on("update-available", () => {
	dialog
		.showMessageBox(mainWindow, {
			type: "question",
			title: "Atualização Disponível",
			message:
				"Uma nova atualização está disponível. Deseja instalá-la agora?",
			buttons: ["Sim", "Não"],
		})
		.then((result) => {
			if (result.response === 0) {
				autoUpdater.downloadUpdate();
			}
		});
});

autoUpdater.on("update-downloaded", () => {
	dialog.showMessageBox(mainWindow, {
		type: "info",
		title: "Atualização baixada",
		message:
			"A atualização foi baixada. Reinicie a aplicação para aplicar as mudanças.",
		buttons: ["OK"],
	}).then(() => {
		autoUpdater.quitAndInstall();
	});
});

ipcMain.on("restart_app", () => {
	autoUpdater.quitAndInstall();
});
