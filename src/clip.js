import audioEngine from '@/audioengine';
import { v4 as uuidv4 } from 'uuid';

import Track from '@/track';

export default class Clip {
	constructor(name, filename, /**@type {Track} */track) {
		this.name = name;
		this.filename = filename;
		this.nativeAudioEvent = new audioEngine.NativeAudioEvent(name, filename);
		this.id = uuidv4();
		this.track = track;
	}

	play() {
		console.log('play');
		this.track.playClip(this);
	}
}
