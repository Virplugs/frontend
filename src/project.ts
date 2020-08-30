import audioEngine from '@/audioengine';
import Track from '@/track';
import ProjectComp from '@/components/Project.vue';

export default class Project {
	transport: audioEngine.NativeTransport;
	cueTrack: Track;
	masterTrack: Track;


	constructor() {
		this.transport = new audioEngine.NativeTransport();
		this.cueTrack = new Track("Cue");
		this.transport.cueTrack = this.cueTrack.nativeTrack;
		this.masterTrack = new Track("Master");
		this.masterTrack.color = "#B5B2B1";
		this.transport.masterTrack = this.masterTrack.nativeTrack;
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

export function getProject(vueElement?: Vue): Project {
	return getProjectComponent(vueElement).project;
}

export function getProjectComponent(vueElement?: Vue): ProjectComp {
	if (!vueElement) {
		return (window as any).app.$refs.tabs.getCurrentTab();
	}

	while (!!vueElement && !(vueElement as any).FLAG__isRootProject) {
		vueElement = vueElement.$parent;
	}
	return vueElement as ProjectComp;
}
