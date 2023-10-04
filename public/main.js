"use strict";var _electron = require('electron');
var _path = require('path');

const path_pesquisa = _path.join.call(void 0, process.resourcesPath, 'pesquisa.exe');

_electron.app.whenReady().then(() => {
 _electron.shell.openPath(_path.resolve.call(void 0, path_pesquisa));
})