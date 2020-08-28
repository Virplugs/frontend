import audioEngine from '@/audioengine';
import { v4 as uuidv4 } from 'uuid';
import Clip from '@/clip';

let currentHue = 46;

export default class Track {
	constructor(name, /**@type {Track}*/parent = null) {
		this.nativeTrack = new audioEngine.NativeTrack(name, [0], [0]);
		this.color = `hsl(${currentHue % 360}, 65%, 47%)`;
		this.name = name;
		this.clips = Array(8);
		this.id = uuidv4();
		this.subTracks = [];
		this.parent = parent;

		currentHue += 30;
	}

	playClip(/**@type {Clip} */clip) {
		if (!this.clips.includes(clip)) {
			console.warn("Track does not contain clip", this, clip);
		}
		this.nativeTrack.playAudioEvent(clip.nativeAudioEvent);
	}

	addSubTrack(/**@type {Track} */track, index) {
		this.nativeTrack.addSubTrack(track.nativeTrack, index);
		if (index !== undefined) {
			this.subTracks.splice(index, 0, track);
		} else {
			this.subTracks.push(track);
		}
		track.parent = this;
	}

	removeSubTrack(/**@type {Track} */track) {
		this.nativeTrack.removeSubTrack(track.nativeTrack);
		const index = this.subTracks.indexOf(track);
		if (index !== -1) {
			this.subTracks.splice(index, 1);
		}
		track.parent = null;
	}

	/** @returns {Track} */
	findTrackByID(id) {
		for (const track of this.subTracks) {
			if (track.id === id) {
				return track;
			}
		}
		for (const track of this.subTracks) {
			const found = track.findTrackByID(id);
			if (found) {return found;}
		}
		return null;
	}
}
