import audioEngine from '@/audioengine';
import { v4 as uuidv4 } from 'uuid';

import Track from '@/track';

export default class Clip {
	name: string;
	filename: string;
	nativeAudioEvent: audioEngine.NativeAudioEvent;
	id: string;
	track: Track;

	constructor(name: string, filename: string, track: Track) {
		this.name = name;
		this.filename = filename;
		this.nativeAudioEvent = new audioEngine.NativeAudioEvent(name, filename);
		this.id = uuidv4();
		this.track = track;
	}

	play(time?: number) {
		console.log('play');
		this.track.playClip(this, time);
	}
}
