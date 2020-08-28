import audioEngine from '@/audioengine';
import Track from '@/track';

export default class Project {
	constructor() {
		this.transport = new audioEngine.NativeTransport();
		this.cueTrack = new Track("Cue");
		this.transport.cueTrack = this.cueTrack.nativeTrack;
		this.masterTrack = new Track("Master");
		this.masterTrack.color = "#B5B2B1";
		this.transport.masterTrack = this.masterTrack.nativeTrack;

		this.currentHue = 46;
	}

	/** @returns {Track} */
	createNewTrack(name = 'Track #') {
		const track = new Track(name);
		this.masterTrack.addSubTrack(track);
		return track;
	}

	setActive() {
		audioEngine.setActiveTransport(this.transport);
	}
}

/** @returns {Project} */
export function getProject(/** @type {Vue} */ vueElement) {
	return getProjectComponent(vueElement).project;
}

/** @returns {Vue} */
export function getProjectComponent(/** @type {Vue} */ vueElement) {
	if (!vueElement) {
		return window.app.$refs.tabs.getCurrentTab();
	}

	while (!!vueElement && !vueElement.FLAG__isRootProject) {
		vueElement = vueElement.$parent;
	}
	return vueElement;
}
