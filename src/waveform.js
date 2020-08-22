import * as ae from "@/audioengine.js";

const fs = __non_webpack_require__("fs");
const path = __non_webpack_require__("path");

const internalCache = {};

async function process(file, window, cache = {}) {
	//console.log("window: " + window);

	let waveformData;

	if (!cache[window]) {
		waveformData = await ae.readAudioFileWaveform(file, window);
		if (window >= 128) {
			cache[window] = waveformData;
			fs.writeFile(file + ".vpm", JSON.stringify(cache), () => { });
			internalCache[file] = cache;
		}
	} else {
		waveformData = cache[window];
	}

	return {
		file,
		waveformData,
		waveformWindow: window
	};
}

export function requestWaveform(file, window) {
	//console.log('requestWaveform', file, window)
	return new Promise(async function (resolve) {
		//let info = await ae.readAudioFileInfo(file);

		if (window < 1) return resolve ({
			file,
			waveformData: null,
			waveformWindow: 0
		});

		if (internalCache[file]) {
			resolve(await process(file, window, internalCache[file]));
		} else {
			fs.stat(file + ".vpm", function (err, stats) {
				fs.open(file + ".vpm", "r", (err, fd) => {
					if (err) {
						if (err.code === "ENOENT") {
							resolve(process(file, window));
							return;
						}
						throw err;
					}
					const buffer = new Buffer(stats.size);
					fs.read(fd, buffer, 0, buffer.length, null, async (error, bytesRead, buffer) => {
						try {
							const cache = JSON.parse(buffer);
							resolve(await process(file, window, cache));
						} catch {
							resolve(await process(file, window));
						}
					});
				});
			});
		}
	});
}
