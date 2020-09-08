<template>
	<div class="group">
		<div
			class="clips"
			:class="{ hasLastSelected: hasLastSelected }"
			v-if="track.subTracks.length === 0"
		>
			<div
				class="clip"
				v-for="(clip, index) in track.clips"
				:key="clip ? clip.id : index"
				@dragover="onclipdragover($event, index, clip)"
				@dragleave="onclipdragleave($event, index, clip)"
				@drop.stop="onclipdrop($event, index, clip)"
				@mousedown.stop="$emit('select', { clip, index, $event })"
				:class="{ selected: selectedclips.includes(clip) }"
			>
				<track-clip
					class="fill audioclip"
					v-if="isAudioClip(clip)"
					:track="track"
					:clip="clip"
				/>
				<div v-else class="fill empty">
					<img src="@/assets/icons/stop.svg" class="stop" />
				</div>
				<div :class="{ visible: dragoverstate[index] }" class="drag">
					<div class="color" :style="`background-color: ${track.color};`" />
					<img src="@/assets/icons/play.svg" class="play" />

					<div class="title">
						{{ dragoverstate[index] }}
					</div>
				</div>
			</div>
		</div>
		<group-track-clips
			v-else
			:track="track"
			:selectedtracks="selectedtracks"
			:selectedclips="selectedclips"
			:collapsedtracks="collapsedtracks"
		/>
		<template v-if="track.subTracks.length && !collapsedtracks[track.id]">
			<track-clips
				v-for="(subTrack, index) of track.subTracks"
				:track="subTrack"
				:index="index"
				:key="subTrack.id"
				:selectedclips="selectedclips"
				:selectedtracks="selectedtracks"
				:collapsedtracks="collapsedtracks"
				:lastselected="lastselected"
				@select="$emit('select', $event)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import TrackClip from './TrackClip.vue';
import GroupTrackClips from './GroupTrackClips.vue';
import Clip, { AudioClip } from '@/clip';
import path = require('path');
import Track from '@/track';

@Component({
	name: 'track-clips',
	components: {
		TrackClip,
		GroupTrackClips,
	},
})
export default class Mixer extends Vue {
	dragoverstate: number[] = [];

	@Prop({ required: true }) track!: Track;
	@Prop({ required: true }) selectedtracks!: Track[];
	@Prop({ required: true }) selectedclips!: Clip[];
	@Prop({ required: true }) lastselected!: { type: object; item: object };
	@Prop({ required: true }) collapsedtracks!: Track[];

	onclipdragover($event: DragEvent, index: number, clip: Clip) {
		if ($event.dataTransfer?.types.includes('text/virplugs-inode')) {
			$event.preventDefault();
			if (!($event.currentTarget as HTMLElement).classList.contains('dragover')) {
				//const file = JSON.parse($event.dataTransfer.getData('text/virplugs-inode'));
				const nameId = 'text/virplugs-inode/name:';
				const name = $event.dataTransfer.types
					.find(t => t.startsWith(nameId))
					?.substr(nameId.length);
				($event.currentTarget as HTMLElement).classList.add('dragover');
				this.$set(this.dragoverstate, index, name || '');
			}
		}
	}

	onclipdragleave($event: DragEvent, index: number, clip: Clip) {
		($event.currentTarget as HTMLElement).classList.remove('dragover');
		this.$set(this.dragoverstate, index, false);
	}

	onclipdrop($event: DragEvent, index: number, clip: Clip) {
		($event.currentTarget as HTMLElement).classList.remove('dragover');
		this.$set(this.dragoverstate, index, false);
		const file = JSON.parse($event.dataTransfer?.getData('text/virplugs-inode') ?? '{}');
		const name = path.parse(file.path).name;
		this.$set(this.track.clips, index, new AudioClip(name, file.path, this.track));
		console.log(this.dragoverstate);
	}

	isAudioClip(clip: Clip) {
		return clip instanceof AudioClip;
	}

	get hasLastSelected() {
		return (
			(this.lastselected &&
				this.lastselected.type &&
				this.lastselected.item &&
				this.lastselected.type === Track &&
				this.lastselected.item === this.track) ||
			(this.lastselected.type === Clip &&
				this.track.clips.includes(this.lastselected.item as Clip))
		);
	}
}
</script>

<style scoped lang="less">
.group {
	display: flex;
}

.clips {
	background: #5a5a5a;
	display: flex;
	flex-direction: column;
	width: 145px;
	flex-shrink: 0;
	border-right: 1px solid #202020;

	&.hasLastSelected {
		background: #6a6a6a;
	}

	> .clip {
		height: 32px;
		border-bottom: 1px solid #505050;
		display: flex;
		position: relative;

		.clip {
			z-index: 9;
		}

		&.dragover {
			.empty .stop {
				display: none;
			}
		}

		.empty {
			display: block;
			width: 100%;
			line-height: 32px;
			padding-left: 5px;
			z-index: 9;

			.stop {
				width: 13px;
				height: 13px;
				display: block;
				margin: 10px;
				filter: invert(100%) brightness(0.7);
			}
		}

		&.selected .empty {
			background: rgba(255, 255, 255, 0.1);
		}

		.drag {
			display: flex;
			width: 100%;
			line-height: 32px;
			top: 0;
			left: 0;
			position: absolute;
			opacity: 0;
			font-size: 14px;
			background: #353535;
			z-index: 0;
			pointer-events: none;

			* {
				pointer-events: none;
			}

			.color {
				flex-basis: 5px;
			}

			.play {
				width: 13px;
				height: 13px;
				display: block;
				margin: 10px;
			}

			.title {
				flex: 1 1;
				line-height: 32px;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				margin-right: 5px;
				font-weight: 500;
			}

			&.visible {
				opacity: 0.5;
				z-index: 10;
			}
		}
	}
}
</style>
