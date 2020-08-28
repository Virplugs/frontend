import audioEngine from '@/audioengine';
import { v4 as uuidv4 } from 'uuid';

import Track from '@/track';

export default class GroupClip {
	constructor(name, /**@type {Track} */track) {
		this.name = name;
		this.id = uuidv4();
		this.track = track;
	}

	play() {
		console.log('play gorup');
	}
}
