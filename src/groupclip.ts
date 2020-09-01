import { v4 as uuidv4 } from 'uuid';

import Track from '@/track';

export default class GroupClip {
	name: string;
	id: string;
	track: Track;

	constructor(name: string, track: Track) {
		this.name = name;
		this.id = uuidv4();
		this.track = track;
	}

	play() {
		console.log('play gorup');
	}
}
