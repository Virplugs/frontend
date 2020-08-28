<template>
	<div class="group">
		<div
			class="clips"
			:class="{selected: selectedtracks.includes(track)}"
			v-if="track.subTracks.length === 0"
		>
			<div
				class="clip"
				v-for="(clip, index) in track.clips"
				:key="clip ? clip.id : index"
				@dragover="onclipdragover($event, index, clip)"
				@dragleave="onclipdragleave($event, index, clip)"
				@drop.stop="onclipdrop($event, index, clip)"
			>
				<track-clip class="fill audioclip" v-if="clip" :track="track" :clip="clip" />
				<div v-else class="fill empty">
					<img src="@/assets/icons/stop.svg" class="stop">
				</div>
				<div :class="{ visible: dragoverstate[index] }" class="drag">
					<div class="color" :style="`background-color: ${track.color};`" />
					<img src="@/assets/icons/play.svg" class="play">

					<div class="title">
						{{ dragoverstate[index] }}
					</div>
				</div>
			</div>
		</div>
		<group-track-clips v-else :track="track" :selectedtracks="selectedtracks" :collapsedtracks="collapsedtracks" />
		<template v-if="track.subTracks.length && !collapsedtracks[track.id]">
			<track-clips
				v-for="(subTrack, index) of track.subTracks"
				:track="subTrack"
				:index="index"
				:key="subTrack.id"
				:selectedtracks="selectedtracks"
				:collapsedtracks="collapsedtracks"
			/>
		</template>
	</div>
</template>

<script>
import TrackClip from './TrackClip.vue';
import GroupTrackClips from './GroupTrackClips.vue';
import Clip from '@/clip';
const path = require('path');

export default {
	name: 'TrackClips',
	components: {
		TrackClip,
		GroupTrackClips,
	},
	props: {
		track: {
			type: Object,
			required: true,
		},
		selectedtracks: {
			type: Array,
			required: true,
		},
		collapsedtracks: {
			type: Array,
			default: () => {},
		},
	},
	data: function () {
		return { dragoverstate: {} };
	},
	methods: {
		onclipdragover($event, index, clip) {
			if ($event.dataTransfer.types.includes('text/virplugs-inode')) {
				$event.preventDefault();
				if (!$event.currentTarget.classList.contains('dragover')) {
					//const file = JSON.parse($event.dataTransfer.getData('text/virplugs-inode'));
					const nameId = 'text/virplugs-inode/name:';
					const name = $event.dataTransfer.types
						.find(t => t.startsWith(nameId))
						.substr(nameId.length);
					$event.currentTarget.classList.add('dragover');
					this.$set(this.dragoverstate, index, name || '');
				}
			}
		},
		onclipdragleave($event, index, clip) {
			$event.currentTarget.classList.remove('dragover');
			this.$set(this.dragoverstate, index, false);
		},
		onclipdrop($event, index, clip) {
			$event.currentTarget.classList.remove('dragover');
			this.$set(this.dragoverstate, index, false);
			const file = JSON.parse($event.dataTransfer.getData('text/virplugs-inode'));
			const name = path.parse(file.path).name;
			this.$set(this.track.clips, index, new Clip(name, file.path, this.track));
			console.log(this.dragoverstate);
		},
	},
};
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

	&.selected {
		background: #6a6a6a;
	}

	> .clip {
		height: 32px;
		border-bottom: 1px solid #505050;
		display: flex;
		position: relative;

		.clip { z-index: 9; }

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
