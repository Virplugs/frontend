const path = __non_webpack_require__('path');
const process = __non_webpack_require__('process');

const audioEngine = __non_webpack_require__('@virplugs/audioengine');

let deviceinfo = {};

export function init() {
	deviceinfo = audioEngine.getDeviceInfo();
	console.dir(deviceinfo);
	audioEngine.setEventsCallback((eventName, data) => {
		console.info("Event", eventName, data);
		window.app.$root.$emit(eventName, data);
	});
}

export function getDeviceInfo() {
	return deviceinfo;
}

export function start(api, deviceNameIn, deviceNameOut, sampleRate, bufferSize) {
	audioEngine.startAudioEngine(
		api,
		deviceinfo[api].devices.findIndex(d => d.name === deviceNameIn),
		deviceinfo[api].devices.findIndex(d => d.name === deviceNameOut),
		sampleRate,
		bufferSize
	);
}

export function stop() {
	try {
		audioEngine.stopAudioEngine();
	} catch {

	}
}

export function openAsioControlPanel() {
	audioEngine.openAsioControlPanel();
}


export function requestLatencyInfo() {
	audioEngine.requestLatencyInfo();
}

export function readAudioFileInfo(filename) {
	return new Promise(function (resolve, reject) {
		audioEngine.readAudioFileInfo(filename, (err, info) => {
			if(err) return reject(err);
			return resolve(info);
		});
	});
}

export function readAudioFileWaveform(filename, window) {
	return new Promise(function (resolve, reject) {
		audioEngine.readAudioFileWaveform(filename, window, (err, cache) => {
			//console.log(err);
			if (err) return reject(err);
			return resolve(cache);
		});
	});
}

export default audioEngine;
