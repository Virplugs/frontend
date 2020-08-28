import { getProject, getProjectComponent } from '@/project';

const remote = require('electron').remote;
const { app, Menu } = remote;
const process = remote.require('process');

const isMac = process.platform === 'darwin';
const isDeveloper = !app.isPackaged;

export const template = [
	...(isMac
		? [
				{
					label: app.name,
					id: 'app',
					submenu: [
						{ role: 'about' },
						{ type: 'separator' },
						{
							label: 'Preferences',
							accelerator: 'Cmd+,',
							click: () => window.app.openPreferences(),
						},
						{ label: 'Virplugs account...' },
						{ type: 'separator' },
						{ role: 'services' },
						{ type: 'separator' },
						{ role: 'hide' },
						{ role: 'hideothers' },
						{ role: 'unhide' },
						{ type: 'separator' },
						{ role: 'quit' },
					],
				},
		]
		: []),

	{
		label: 'File',
		id: 'file',
		submenu: [
			{ label: 'New project...' },
			{
				label: 'Open project...',
				click: () => {
					window.app.openProject();
				},
				accelerator: 'CommandOrControl+O',
			},
			{ label: 'Clone project...' },
			{ label: 'Starting page' },
			{ type: 'separator' },
			{ label: 'Close file' },
			{ label: 'Close project' },
			{ label: 'Reload file' },
			{ type: 'separator' },
			{ label: 'Save file' },
			{
				label: 'Save',
				click: () => {
					window.app.saveCurrentEditor();
				},
				accelerator: 'CommandOrControl+S',
			},
			{ label: 'Save file as...' },
			{ label: 'Save all' },
			{ type: 'separator' },
			...(!isMac
				? [
						{ label: 'Virplugs account...' },
						{
							label: 'Preferences',
							accelerator: 'CmdOrCtrl+,',
							click: () => window.app.openPreferences(),
						},
				]
				: []),
			{ type: 'separator' },
			isMac ? { role: 'close' } : { role: 'quit' },
		],
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
			...(isMac
				? [
						{ role: 'pasteAndMatchStyle' },
						{ role: 'delete' },
						{ role: 'selectAll' },
						{ type: 'separator' },
						{
							label: 'Speech',
							submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
						},
				]
				: [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
			{ type: 'separator' },
			{
				label: 'Delete Selected',
				accelerator: 'Delete',
				click: () => getProjectComponent().deleteSelected(),
			},
			{ type: 'separator' },
			{
				label: 'Group Selected',
				accelerator: 'CmdOrCtrl+G',
				click: () => getProjectComponent().groupSelected(),
			},
		],
	},

	{
		label: 'Create',
		id: 'create',
		submenu: [
			{
				label: 'Insert Track',
				accelerator: 'CmdOrCtrl+T',
				click: () => getProject().createNewTrack(),
			},
		],
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
		],
	},

	...(isDeveloper
		? [
				{
					label: 'Developer',
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
							},
						},
					],
				},
		]
		: []),

	{
		label: 'Window',
		id: 'window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			...(isMac
				? [
						{ type: 'separator' },
						{ role: 'front' },
						{ type: 'separator' },
						{ role: 'window' },
				]
				: [{ role: 'close' }]),
		],
	},

	{
		role: 'help',
		id: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					const { shell } = require('electron');
					await shell.openExternal('https://electronjs.org');
				},
			},
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
		],
	},
];

export const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

export function openMenu(id) {
	menu.getMenuItemById(id).submenu.popup({ window: remote.getCurrentWindow() });
}
