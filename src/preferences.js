const { app } = require('electron').remote;
const path = require('path');
const fs = require('fs');

const prefFile = path.join(app.getPath('userData'), 'preferences.json');

console.log('Preferences file:', prefFile);

let preferences = {};

if (fs.existsSync(prefFile)) {
	preferences = JSON.parse(fs.readFileSync(prefFile));
} else {
	commit();
}

export function commit() {
	fs.writeFile(prefFile, JSON.stringify(preferences), () => {});
}

export function commitSync() {
	fs.writeFileSync(prefFile, JSON.stringify(preferences));
}

export function getCopy() {
	return JSON.parse(JSON.stringify(preferences));
}

export function setFromObject(obj) {
	preferences = { ...preferences, ...obj };
}

export function get(key) {
	return preferences[key];
}

export function set(key, val) {
	preferences[key] = val;
}
