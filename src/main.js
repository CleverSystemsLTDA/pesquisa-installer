import { app, shell } from 'electron';
import { resolve, join } from 'path';

const path_pesquisa = join(process.resourcesPath, 'pesquisa.exe');

app.whenReady().then(() => {
 shell.openPath(resolve(path_pesquisa));
})