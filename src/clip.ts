import audioEngine from '@/audioengine';
import { v4 as uuidv4 } from 'uuid';

import Track from '@/track';

export default class Clip {
	name: string;
	id: string;
	track: Track;
	color: string;

	constructor(name: string,  track: Track) {
		this.name = name;
		this.id = uuidv4();
		this.track = track;
		this.color = track.color;
	}

	play(time?: number) {
	}
}
export class AudioClip extends Clip {
	filename: string;
	nativeAudioEvent: audioEngine.NativeAudioEvent;

	constructor(name: string, filename: string, track: Track) {
		super(name, track);
		this.filename = filename;
		this.nativeAudioEvent = new audioEngine.NativeAudioEvent(name, filename);
	}

	play(time?: number) {
		console.log('play');
		this.track.playClip(this, time);
	}
}

export class GroupClip extends Clip {

	play() {
		console.log('play gorup');
	}
}
