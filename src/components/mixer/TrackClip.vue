<template>
	<div class="clip">
		<div class="color" :style="`background-color: ${track.color};`" />
		<img src="@/assets/icons/play.svg" class="play" @mousedown="play" />

		<div class="title">
			{{ clip.name }}
		</div>
	</div>
</template>

<script>
import Clip from '@/clip';
export default {
	props: {
		track: {
			type: Object,
			required: true,
		},
		clip: {
			type: Clip,
			required: true,
		},
	},
	methods: {
		play() {
			this.clip.play();
		},
	},
};
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
