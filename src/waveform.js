import * as ae from "@/audioengine.js";

const fs = __non_webpack_require__("fs");
const path = __non_webpack_require__("path");

const internalCache = {};

async function process(file, window, cache = {}) {
	//console.log("window: " + window);
	if (!cache[window]) {
		await createCacheResolution(file, window, cache);
	}
	internalCache[file] = cache;
	return {
		file,
		waveformData: cache[window],
		waveformWindow: window
	};
}

async function createCacheResolution(file, window, cache) {
	//console.log("create");
	cache[window] = await ae.readAudioFileWaveform(file, window);
	fs.writeFile(file + ".vpm", JSON.stringify(cache), () => { });
}

export function requestWaveform(file, window) {
	//console.log('requestWaveform', file, window)
	return new Promise(async function (resolve) {
		//let info = await ae.readAudioFileInfo(file);

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
