<template>
	<div class="clips" :class="{selected: selectedtracks.includes(track)}">
		<div
			class="clip"
			v-for="(clip, index) in track.clips"
			:key="clip ? clip.id : index"
		>
			<group-track-clip class="fill groupclip" :track="track" :clip="clip" :index="index" />
		</div>
	</div>
</template>

<script>
import GroupTrackClip from './GroupTrackClip.vue';
import Clip from '@/clip';

export default {
	components: {
		GroupTrackClip,
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
	},
};
</script>

<style scoped lang="less">

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

	.master & {
		border-right: none;
		border-left: 1px solid #202020;
	}
}

</style>
