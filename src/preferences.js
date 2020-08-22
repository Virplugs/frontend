const { app } = __non_webpack_require__('electron').remote;
const path = __non_webpack_require__('path');
const fs = __non_webpack_require__('fs');

const prefFile = path.join(app.getPath('userData'), 'preferences.json');

console.log("Preferences file:", prefFile);

let preferences = {
	audio_api: 'ds'
};

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
	preferences = {...preferences, ...obj};
}

export function get(key) {
	return preferences[key];
}

export function set(key, val) {
	 preferences[key] = val;
}
