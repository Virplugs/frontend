<template>
	<div class="clip">
		<div class="color" :style="`background-color: ${track.color};`" />
		<img src="@/assets/icons/play.svg" class="play" @mousedown="play" />

		<div class="title">
			{{ clip.name }}
		</div>
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import Track from '@/track';
import Clip from '@/clip';
import { getProject } from '@/project';

@Component
export default class TrackClip extends Vue {
	@Prop({ required: true }) track!: Track;
	@Prop({ required: true }) clip!: Clip;

	play() {
		if (getProject(this).transport.isPlaying) {
			const timingInfo = getProject(this).transport.timingInfo;
			const nextBarInSeconds =
				(1.0 -
					(timingInfo.projectTimeMusicBars -
						Math.floor(timingInfo.projectTimeMusicBars))) *
				(60.0 / timingInfo.tempo) *
				timingInfo.timeSigNumerator;
			const nextBarInSamples = timingInfo.samplerate * nextBarInSeconds;
			this.clip.play(timingInfo.projectTimeSamples + nextBarInSamples);
		} else {
			getProject(this).transport.setTimeInSamples(0);
			this.clip.play();
			getProject(this).transport.start();
		}
	}
}
</script>

<style scoped lang="less">
.clip {
	background: #353535;
	display: flex;
	flex-direction: row;
	width: 100%;
	font-size: 14px;

	.selected & {
		background: #454545;
	}

	.color {
		flex-basis: 5px;
	}

	.play {
		width: 13px;
		height: 13px;
		display: block;
		padding: 10px;

		&:hover {
			width: 16px;
			height: 16px;
			padding: 9px;
			padding-right: 8px;
		}

		&:active {
			width: 13px;
			height: 13px;
			padding: 10px;
			filter: brightness(0.8);
		}
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
}
</style>
