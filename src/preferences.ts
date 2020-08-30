import electron = require('electron');
const { app } = electron.remote;
import path = require('path');
import fs = require('fs');

const prefFile = path.join(app.getPath('userData'), 'preferences.json');

console.log('Preferences file:', prefFile);

type PreferenceType = string | number | boolean;

let preferences: Record<string, PreferenceType> = {};

if (fs.existsSync(prefFile)) {
	preferences = JSON.parse(fs.readFileSync(prefFile).toString());
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

export function setFromObject(obj: any) {
	preferences = { ...preferences, ...obj };
}

export function get(key: string) {
	return preferences[key];
}

export function set(key: string, val: PreferenceType) {
	preferences[key] = val;
}
