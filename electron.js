const { app, BrowserWindow } = require('electron');
const modal = require('electron-modal');

const { initSplashScreen, OfficeTemplate } = require('electron-splashscreen');

const fs = require('fs');
const path = require('path');

const isDev = require('electron-is-dev');

if (!process.env.NODE_ENV && !isDev) {
	console.log("going to prod");
	process.env.NODE_ENV = 'production';
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

app.setName("Virplugs");

// fix for fs API stopping: https://github.com/electron/electron/issues/22119
// Might result in some native modules breaking?
app.allowRendererProcessReuse = false;

function createWindow () {
	// Create the browser window.
	modal.setup();

	let enableSplashScreen = true;

	console.log(`Running in mode ${process.env.NODE_ENV} (app.isPackaged: ${app.isPackaged})`);

	if (process.env.NODE_ENV !== 'production') {
		require('vue-devtools').install();
		enableSplashScreen = false;
	}

	win = new BrowserWindow({
		width: 1300,
		height: 870,
		frame: true,
		transparent: false,
		thickFrame: true,
		resizable: true,
		hasShadow: true,
		show: !enableSplashScreen,
		vibrancy: 'dark',
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: true,
			nativeWindowOpen: true,
			sandbox: false
		}
	});

	win.webContents.on('new-window', (event, url, frameData, disposition, options, additionalFeatures) => {
		// open window as modal
		frameData = JSON.parse(frameData);
		event.preventDefault();
		Object.assign(options, {
			modal: frameData.type === 'modal',
			parent: win,
			frame: true,
			titleBarStyle: 'default',
			vibrancy: 'dark',
			backgroundColor: '#2D2A2F',
			show: false,
			title: frameData.title
		});
		event.newGuest = new BrowserWindow(options);
		event.newGuest.menuBarVisible = false;
		setTimeout(() => event.newGuest.show(), 50);

		// Workaround for mainwindow flicker from
		// https://github.com/electron/electron/issues/10616
		event.newGuest.on('focus', () => { win.setAlwaysOnTop(true); });
		event.newGuest.on('blur', () => { win.setAlwaysOnTop(false); });
		event.newGuest.on('close', () => { win.setAlwaysOnTop(true); });
		event.newGuest.on('closed', () => { win.setAlwaysOnTop(false); });
	});

	if (enableSplashScreen) {
		const logoData64 = fs.readFileSync(path.join(app.getAppPath(), 'dist', require("./resources/logotext.png")), 'base64');
		initSplashScreen({
			mainWindow: win,
			//icon: isDev ? resolve('assets/icon.ico') : undefined,
			url: OfficeTemplate,
			width: 500,
			height: 250,
			color: "#6543A9",
			brand: `<img
		         src="data:image/png;base64,${logoData64}"
		         style="width: auto; margin-left: -22px; margin-top: 10px; height: 32px;">`,
			productName: 'Virplugs',
			//logo: 'data:image/svg+xml;base64,' + fs.readFileSync('./public/logo.svg', 'base64'),
			//logo: 'data:image/png;base64,' + fs.readFileSync('./public/logotext.png', 'base64'),
			logo: '',
			website: 'Version ' + app.getVersion(),
			text: 'Initializing ...'
		});
	}

	// and load the index.html of the app.
	// TODO: do production build for local
	if (process.env.NODE_ENV !== 'production') {
		win.loadURL('http://localhost:8123');
	} else {
		win.loadFile('./dist/index.html');
	}

	// Open the DevTools.
	//win.webContents.openDevTools()

	// Emitted when the window is closed.
	win.on('closed', (e) => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		console.log("closed", e);
		win = null;
	});


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});
