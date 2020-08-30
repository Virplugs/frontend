import audioEngine = require('@virplugs/audioengine');

let deviceinfo: audioEngine.DeviceInfo = {};

let audioEngineInitialized = false;

export async function init() {
	if (audioEngineInitialized) {
		return false;
	}

	deviceinfo = audioEngine.getDeviceInfo();
	console.dir(deviceinfo);
	audioEngine.setEventsCallback((eventName: string, data: any) => {
		console.info('Event', eventName, data);
		(window as any).app.$root.$emit(eventName, data);
	});

	audioEngineInitialized = true;

	return true;
}

export function getDeviceInfo() {
	return deviceinfo;
}

export function start(api: string, deviceNameIn: string, deviceNameOut: string, sampleRate: number, bufferSize: number) {
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
	} catch (e) {
		console.error(e);
	}
}

export function openAsioControlPanel() {
	audioEngine.openAsioControlPanel();
}

export function requestLatencyInfo() {
	audioEngine.requestLatencyInfo();
}

export function readAudioFileInfo(filename: string): Promise<audioEngine.FileInfo> {
	return new Promise(function (resolve, reject) {
		audioEngine.readAudioFileInfo(filename, (err, info) => {
			if (err) {
				return reject(err);
			}
			return resolve(info);
		});
	});
}

export function readAudioFileWaveform(filename: string, window: number): Promise<audioEngine.WaveformOverview[]> {
	return new Promise(function (resolve, reject) {
		audioEngine.readAudioFileWaveform(filename, window, (err, cache) => {
			//console.log(err);
			if (err) {
				return reject(err);
			}
			return resolve(cache);
		});
	});
}

export default audioEngine;
