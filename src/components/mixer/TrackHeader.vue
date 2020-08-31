<template>
	<div class="channel" @mousedown.stop="$emit('select', { track, $event })">
		<div class="color" :style="`background-color: ${track.color};`" />
		<div class="container">
			<div
				class="maintrack"
				:class="{
					selected: selectedtracks.includes(track),
					collapsed: !!collapsedtracks[track.id],
				}"
				draggable="true"
				@dragover="ondragover($event, track)"
				@dragleave="ondragleave($event, track)"
				@drop.stop="ondrop($event, track)"
				@dragstart="dragstart($event, track)"
			>
				<div class="title">
					{{ name }}
				</div>

				<img
					v-if="track.subTracks.length"
					class="collapser"
					src="@/assets/icons/mixer_collapse.svg"
					@mousedown="collapse(track)"
				/>
			</div>
			<template v-if="showSubtracks && !collapsedtracks[track.id]">
				<track-header
					class="subtrack"
					v-for="(subTrack, index) of track.subTracks"
					:track="subTrack"
					:index="index"
					:key="subTrack.id"
					:selectedtracks="selectedtracks"
					:collapsedtracks="collapsedtracks"
					@select="$emit('select', $event)"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import Track from '@/track';
import { getProject } from '@/project';

export default {
	name: 'TrackHeader',
	props: {
		track: {
			type: Track,
			required: true,
		},
		selectedtracks: {
			type: Array,
			default: () => [],
		},
		collapsedtracks: {
			type: Array,
			required: true,
		},
		index: {
			type: Number,
			default: 0,
		},
		showSubtracks: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		name() {
			return this.track.name.replace(/#/g, this.index + 1);
		},
	},
	methods: {
		dragstart($event, track) {
			$event.dataTransfer.setData('text/virplugs-track', track.id);
		},
		ondragover($event) {
			if (this.showSubtracks && $event.dataTransfer.types.includes('text/virplugs-track')) {
				$event.preventDefault();

				if ($event.offsetX < 73) {
					$event.currentTarget.classList.add('dropleft');
					$event.currentTarget.classList.remove('dropright');
				} else {
					$event.currentTarget.classList.add('dropright');
					$event.currentTarget.classList.remove('dropleft');
				}
			}
		},
		ondragleave($event) {
			$event.currentTarget.classList.remove('dropleft');
			$event.currentTarget.classList.remove('dropright');
		},
		ondrop($event, /**@type {Track} */ droppedOnTrack) {
			$event.currentTarget.classList.remove('dropright');
			$event.currentTarget.classList.remove('dropleft');
			const id = $event.dataTransfer.getData('text/virplugs-track');
			const track = getProject().masterTrack.findTrackByID(id);
			const oldindex = track.parent.subTracks.indexOf(track);
			let index = $event.offsetX < 73 ? this.index : this.index + 1;
			if (track === droppedOnTrack || track.hasSubTrack(droppedOnTrack)) {
				return;
			}
			if (droppedOnTrack.subTracks.length > 0 && $event.offsetX >= 73) {
				// this is dropped as the first item in a group
				droppedOnTrack = droppedOnTrack.subTracks[0];
				index = 0;
			}
			if (droppedOnTrack.parent.subTracks.includes(track)) {
				// this track is moved within the same array
				if (index >= oldindex) {
					index--;
				}
				if (index === oldindex) {
					return;
				}
			}
			// delete old
			track.parent.removeSubTrack(track);
			// add new
			droppedOnTrack.parent.addSubTrack(track, index);
		},
		collapse(track) {
			this.collapsedtracks[track.id] = !this.collapsedtracks[track.id];
		},
	},
};
</script>

<style scoped lang="less">
.channel {
	background: #202020;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	box-sizing: border-box;

	&:focus {
		outline: none;
	}

	.color {
		height: 6px;
		border-right: 1px solid #202020;
	}

	.container {
		display: flex;
		margin-top: 1px;
		height: 100%;

		.maintrack {
			font-size: 14px;
			color: #b5b2b1;
			width: 145px;
			min-height: 32px;
			height: 100%;
			position: relative;
			border-right: 1px solid #202020;

			&.dropleft {
				&::before {
					content: ' ';
					display: block;
					position: absolute;
					left: -1px;
					width: 2px;
					height: calc(100% + 7px);
					top: -6px;
					background: white;
				}
			}

			&.dropright {
				&::before {
					content: ' ';
					display: block;
					position: absolute;
					right: -2px;
					width: 2px;
					background: white;
					height: calc(100% + 7px);
					top: -6px;
				}
			}

			&.selected {
				background: #303030;
			}

			.title {
				font-weight: 500;
				font-size: 14px;
				position: absolute;
				bottom: 8px;
				left: 8px;
				pointer-events: none;
			}

			.collapser {
				position: absolute;
				right: 8px;
				bottom: 8px;
				width: 18px;
				height: 18px;
			}

			&.collapsed .collapser {
				transform: rotate(90deg);
			}
		}
	}

	&.master .color,
	&.master .maintrack {
		border-right: none;
		border-left: 1px solid #202020;

		.collapser {
			display: none;
		}
	}
}
</style>
