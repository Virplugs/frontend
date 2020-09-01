<template>
	<div class="mixer">
		<div class="tracks-header">
			<track-header
				class="track-header"
				:collapsedtracks="collapsedTracks"
				:selectedtracks="selectedTracks"
				v-for="(track, index) in masterTrack.subTracks"
				:key="track.id"
				:track="track"
				:index="index"
				@select="selectTrack($event)"
			/>
			<div
				class="spacer"
				@dragover="onheaderspacerdragover($event)"
				@dragleave="onheaderspacerdragleave($event)"
				@drop.stop="onheaderspacerdrop($event)"
			/>
			<track-header
				class="track-header master"
				:collapsedtracks="collapsedTracks"
				:selectedtracks="selectedTracks"
				:track="masterTrack"
				:show-subtracks="false"
				@select="selectTrack($event)"
			/>
		</div>
		<div class="tracks-clips">
			<track-clips
				class="track-clips"
				:collapsedtracks="collapsedTracks"
				:selectedtracks="selectedTracks"
				v-for="track in masterTrack.subTracks"
				:key="track.id"
				:track="track"
			/>
			<div class="spacer">
				<div class="dropbox">
					<img src="@/assets/icons/packs.svg" />
					<span>Drop files and devices here</span>
				</div>
			</div>

			<group-track-clips
				class="track-clips group master"
				:collapsedtracks="collapsedTracks"
				:selectedtracks="selectedTracks"
				:show-subtracks="false"
				:track="masterTrack"
			/>
		</div>
		<div class="tracks-controls">
			<track-controls
				class="track-controls"
				:collapsedtracks="collapsedTracks"
				:selectedtracks="selectedTracks"
				v-for="(track, index) in masterTrack.subTracks"
				:key="track.id"
				:track="track"
				:index="index"
			/>
			<div class="spacer" />
			<master-track-controls
				class="track-controls master"
				:selectedtracks="selectedTracks"
				:collapsedtracks="collapsedTracks"
				:track="masterTrack"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import TrackHeader from './TrackHeader.vue';
import TrackClips from './TrackClips.vue';
import GroupTrackClips from './GroupTrackClips.vue';
import TrackControls from './TrackControls.vue';
import MasterTrackControls from './MasterTrackControls.vue';
import Track from '@/track';
import { getProject } from '@/project';

import 'reflect-metadata';
import { Component, Vue, Prop } from 'vue-property-decorator';
import 'vue-class-component/hooks';

@Component({
	components: {
		TrackHeader,
		TrackClips,
		TrackControls,
		GroupTrackClips,
		MasterTrackControls,
	},
})
export default class Mixer extends Vue {
	@Prop({ required: true }) masterTrack!: Track;

	selectedTracks: Track[] = [];
	collapsedTracks: Track[] = [];

	selectTrack({ track, $event }: { track: Track; $event: MouseEvent }) {
		if (!$event.ctrlKey) {
			this.selectedTracks = [];
		}
		if (!this.selectedTracks.includes(track)) {
			this.selectedTracks.push(track);
		}
	}

	removeTrackFromSelection(track: Track) {
		const index = this.selectedTracks.indexOf(track);
		if (index !== -1) {
			this.selectedTracks.splice(index, 1);
		}
	}

	groupSelected() {
		const groupTrack = new Track('Group #');
		const parent = this.selectedTracks[0].parent;
		if (!parent) {
			return;
		}
		const index = parent.subTracks.indexOf(this.selectedTracks[0]);
		if (index === -1) {
			return;
		}
		for (const track of this.selectedTracks) {
			track.parent?.removeSubTrack(track);
			groupTrack.addSubTrack(track);
		}
		parent.addSubTrack(groupTrack, index);
	}

	deleteSelected() {
		for (const track of this.selectedTracks) {
			track.parent?.removeSubTrack(track, true, true);
		}
		this.selectedTracks = [];
	}

	onheaderspacerdragover($event: DragEvent) {
		if ($event.dataTransfer?.types.includes('text/virplugs-track')) {
			$event.preventDefault();
			($event.currentTarget as HTMLElement).classList.add('dropleft');
		}
	}
	onheaderspacerdragleave($event: DragEvent) {
		($event.currentTarget as HTMLElement).classList.remove('dropleft');
	}
	onheaderspacerdrop($event: DragEvent) {
		($event.currentTarget as HTMLElement).classList.remove('dropleft');
		const id = $event.dataTransfer?.getData('text/virplugs-track');
		if (!id) {
			return;
		}
		const track = getProject(this).masterTrack.findTrackByID(id);
		if (!track) {
			return;
		}
		const oldindex = track.parent?.subTracks.indexOf(track);
		let index = getProject(this).masterTrack.subTracks.length - 1;
		if (index === oldindex) {
			return;
		}
		// delete old
		track.parent?.removeSubTrack(track);
		// add new
		getProject(this).masterTrack.addSubTrack(track, index);
	}
}
</script>

<style lang="less" scoped>
.mixer {
	background: #353535;
	user-select: none;
	height: 100%;
	min-width: 100%;
	overflow-x: auto;
	overflow-y: auto;
	display: flex;
	flex-direction: column;

	&::-webkit-scrollbar:horizontal,
	&::-webkit-scrollbar-track:horizontal {
		background: #505050;
	}

	.tracks-header,
	.tracks-clips,
	.tracks-controls {
		display: flex;
	}

	.spacer {
		flex-grow: 2;
		min-width: 200px;
		position: relative;

		.dropbox {
			position: relative;
			border: 2px dashed #5a5a5a;
			border-radius: 8px;
			padding: 20px;
			margin: auto;
			color: #5a5a5a;
			font-size: 14px;
			font-weight: 500;
			text-align: center;
			width: 110px;

			img {
				display: block;
				width: 20px;
				height: 20px;
				margin: auto;
				margin-bottom: 10px;
				filter: brightness(0.6);
			}
		}

		&.dropleft {
			&::before {
				content: ' ';
				display: block;
				position: absolute;
				left: -1px;
				width: 2px;
				background: white;
				height: 100%;
			}
		}
	}

	.tracks-header {
		position: sticky;
		top: 0;
		z-index: 11;

		.master {
			right: 0;
			position: sticky;
		}
	}

	.tracks-clips {
		flex-shrink: 0;
		flex-grow: 2;
		z-index: 10;

		.master {
			right: 0;
			position: sticky;
		}
	}

	.tracks-controls {
		position: sticky;
		bottom: 0;
		z-index: 11;

		.master {
			right: 0;
			position: sticky;
		}
	}
}
</style>
