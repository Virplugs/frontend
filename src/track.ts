import audioEngine from '@/audioengine';
import { v4 as uuidv4 } from 'uuid';
import Clip from '@/clip';

let currentHue = 46;

export default class Track {
	nativeTrack: audioEngine.NativeTrack;
	color: string;
	name: string;
	clips: Clip[];
	id: string;
	subTracks: Track[];
	parent: Track | null;

	constructor(name: string, parent: Track | null = null) {
		this.nativeTrack = new audioEngine.NativeTrack(name, [0], [0]);
		this.color = `hsl(${currentHue % 360}, 65%, 47%)`;
		this.name = name;
		this.clips = Array(8);
		this.id = uuidv4();
		this.subTracks = [];
		this.parent = parent;

		currentHue += 30;
	}

	playClip(clip: Clip, time?: number) {
		if (!this.clips.includes(clip)) {
			console.warn("Track does not contain clip", this, clip);
		}
		this.nativeTrack.playAudioEvent(clip.nativeAudioEvent, time);
	}

	addSubTrack(track: Track, index?: number) {
		this.nativeTrack.addSubTrack(track.nativeTrack, index);
		if (index !== undefined) {
			this.subTracks.splice(index, 0, track);
		} else {
			this.subTracks.push(track);
		}
		track.parent = this;
	}

	removeSubTrack(track: Track, removeIfGroupEmpty = false, removeSubTracks = false) {
		this.nativeTrack.removeSubTrack(track.nativeTrack);
		const index = this.subTracks.indexOf(track);
		if (index !== -1) {
			this.subTracks.splice(index, 1);
		}
		if (removeSubTracks) {
			for (const subtrack of track.subTracks) {
				track.removeSubTrack(subtrack, removeIfGroupEmpty, removeSubTracks);
			}
		}
		track.parent = null;
		if (removeIfGroupEmpty && this.subTracks.length === 0) {
			this.parent?.removeSubTrack(this, removeIfGroupEmpty, removeSubTracks);
		}
	}

	hasSubTrack(track: Track): boolean {
		if (this.subTracks.length === 0) return false;
		if (this.subTracks.some(t => t === track)) {
			return true;
		} else {
			return this.subTracks.some(t => t.hasSubTrack(track));
		}
	}

	findTrackByID(id: string): Track | null {
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
