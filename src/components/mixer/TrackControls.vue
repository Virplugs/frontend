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
					<button class="mute checked">
						{{ index + 1 }}
					</button>

					<button class="solo">S</button>
					<button class="arm checked">
						<img src="@/assets/icons/record.svg" />
					</button>
				</div>
				<div class="spacer" />
				<div class="right">
					<volume :track="track" />
				</div>
			</div>
		</div>
		<template v-if="track.subTracks.length && !collapsedtracks[track.id]">
			<track-controls
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
import Knob from '@/components/Knob.vue';
import Track from '@/track';
import Volume from './Volume.vue';
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
		};
	},
	mounted() {},
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

		.mute {
			margin-bottom: 12px;
			padding: 8px;
		}

		.solo {
			margin-bottom: 12px;
		}

		.solo,
		.arm {
			padding: 4px 8px;
		}

		.arm {
			img {
				width: 10px;
				height: 10px;
			}

			&.checked {
				color: #202020;
				background: #fd1200;

				img {
					filter: invert(100%) brightness(0.6);
				}
			}
		}
	}
}
</style>
