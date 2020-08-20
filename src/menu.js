const remote = nodeRequire('electron').remote;
const { app, Menu } = remote;
const process = remote.require('process');

const isMac = process.platform === 'darwin';
const isDeveloper = process.env.NODE_ENV !== 'production';

export const template = [
	...(isMac ? [{
		label: app.name,
		id: 'app',
		submenu: [
			{ role: 'about' },
			{ type: 'separator' },
			{
				label: 'Preferences',
				accelerator: 'Cmd+,',
				click: () => window.app.openPreferences()
			},
			{ label: "Virplugs account..." },
			{ type: 'separator' },
			{ role: 'services' },
			{ type: 'separator' },
			{ role: 'hide' },
			{ role: 'hideothers' },
			{ role: 'unhide' },
			{ type: 'separator' },
			{ role: 'quit' }
		]
	}] : []),

	{
		label: 'File',
		id: 'file',
		submenu: [
			{ label: "New project..." },
			{
				label: "Open project...",
				click: () => { window.app.openProject(); },
				accelerator: "CommandOrControl+O"
			},
			{ label: "Clone project..." },
			{ label: "Starting page" },
			{ type: 'separator' },
			{ label: "Close file" },
			{ label: "Close project" },
			{ label: "Reload file" },
			{ type: 'separator' },
			{ label: "Save file" },
			{
				label: 'Save',
				click: () => { window.app.saveCurrentEditor(); },
				accelerator: "CommandOrControl+S"
			},
			{ label: "Save file as..." },
			{ label: "Save all" },
			{ type: 'separator' },
			...(!isMac ? [
				{ label: "Virplugs account..." },
				{
					label: 'Preferences',
					accelerator: 'CmdOrCtrl+,',
					click: () => window.app.openPreferences()
				}
			] : []),
			{ type: 'separator' },
			isMac ? { role: 'close' } : { role: 'quit' },
		]
	},

	{
		label: 'Edit',
		id: 'edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			...(isMac ? [
				{ role: 'pasteAndMatchStyle' },
				{ role: 'delete' },
				{ role: 'selectAll' },
				{ type: 'separator' },
				{
					label: 'Speech',
					submenu: [
						{ role: 'startspeaking' },
						{ role: 'stopspeaking' }
					]
				}
			] : [
				{ role: 'delete' },
				{ type: 'separator' },
				{ role: 'selectAll' }
			])
		]
	},

	{
		label: 'View',
		id: 'view',
		submenu: [
			{ role: 'resetzoom' },
			{ role: 'zoomin' },
			{ role: 'zoomout' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' },
			{ type: 'separator' },
			{
				label: 'Refresh Current Editor',
				click: () => { editor.refreshCurrentEditor(); }
			},
			{
				label: 'Reload Current Editor',
				click: () => { editor.reloadCurrentEditor(); }
			},
			{ type: 'separator' },
			{
				label: 'Toggle Output Panel',
				click: () => { $('.statusbar').click(); }
			}
		]
	},

	...(isDeveloper ? [{
		label: "Developer",
		id: 'developer',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{
				label: 'Open JavaScript console',
				click: async () => {
					window.app.openJSConsole();
				}
			}
		]
	}] : []),

	{
		label: 'Window',
		id: 'window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			...(isMac ? [
				{ type: 'separator' },
				{ role: 'front' },
				{ type: 'separator' },
				{ role: 'window' }
			] : [
				{ role: 'close' }
			])
		]
	},

	{
		role: 'help',
		id: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					const { shell } = window.require('electron');
					await shell.openExternal('https://electronjs.org');
				}
			}
		]
	}
];

export const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

export function openMenu(id) {
	menu.getMenuItemById(id).submenu.popup({ window: remote.getCurrentWindow() });
}

