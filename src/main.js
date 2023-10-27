const {
	app,
	shell,
	ipcMain,
	dialog,
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

app.on("ready", () => {
	shell.openPath(resolve(path));
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
	message.innerText =
		"Uma nova atualização está disponível. Baixando agora...";
	dialog
		.showMessageBox({
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
