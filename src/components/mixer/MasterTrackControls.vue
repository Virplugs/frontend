<template>
	<div class="group">
		<div class="controls" :class="{ selected: selectedtracks.includes(track) }">
			<div class="container">
				<div class="left">
					<button class="peaklevel">-2.32</button>
					<knob
						class="pan"
						v-model="someValue"
						title="Pan"
						:min="-50"
						:max="50"
						:is-offset="true"
						:value-display-function="
							v =>
								v === 0 ? 'C' : v < 0 ? `${-Math.round(v)}L` : `${Math.round(v)}R`
						"
					/>
					<knob
						class="cue"
						v-model="cueVolume"
						title="Cue"
						:min="0"
						:max="1.25"
						:default-value="1"
						color="#0BCAE6"
						:value-display-function="v => sample2dBFS(v)"
					/>
				</div>
				<div class="right">
					<volume :track="track" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Knob from '@/components/Knob.vue';
import Volume from './Volume.vue';
import Track from '@/track';
import { getProject } from '@/project';
import { dBFS2sample, sample2dBFS } from '@/units';
export default {
	name: 'TrackControls',
	components: {
		Knob,
		Volume,
	},
	props: {
		track: {
			type: Track,
			required: true,
		},
		index: {
			type: Number,
			default: 0,
		},
		selectedtracks: {
			type: Array,
			default: () => {},
		},
		collapsedtracks: {
			type: Array,
			default: () => {},
		},
	},
	data: function () {
		return {
			someValue: 30,
			cueVolume: 1,
			noiseFloor: dBFS2sample(-72),
		};
	},
	watch: {
		cueVolume(val) {
			let newVal =
				Math.max(this.noiseFloor, val) * Math.max(this.noiseFloor, Math.pow(val, 0.75));

			getProject().cueTrack.nativeTrack.volume = newVal;
		},
	},
	mounted() {},
	methods: {
		sample2dBFS(v) {
			if (v === 0) {
				return '-\u221E dB';
			} else {
				v = Math.max(this.noiseFloor, Math.pow(v, 1 / 0.75));
				const db = sample2dBFS(v);
				return `${db.toFixed(1)} dB`;
			}
		},
	},
};
</script>

<style scoped lang="less">
.group {
	display: flex;
}

.controls {
	background: #505050;
	display: flex;
	flex-direction: row;
	width: 145px;
	flex-shrink: 0;
	border-right: 1px solid #202020;

	&.selected {
		background: #606060;
	}

	.container {
		padding: 8px;
		display: flex;
		flex-direction: row;
		width: 100%;
		box-sizing: border-box;

		.color {
			height: 6px;
		}

		.title {
			font-size: 14px;
			color: #b5b2b1;
			padding: 16px;
		}

		.left,
		.right {
			display: flex;
			flex-direction: column;
			flex: 1 1;
			overflow: hidden;
		}

		.left {
			padding: 4px;
			flex-basis: 44px;
		}

		.right {
			flex-basis: 50px;
			padding-left: 4px;
		}

		.spacer {
			flex: 1 1;
		}

		.peaklevel {
			padding: 4px 8px;
			margin-bottom: 12px;
		}

		.pan {
			margin-bottom: 12px;
		}
	}

	.master & {
		border-right: none;
		border-left: 1px solid #202020;
	}
}
</style>
