<template>
	<div class="clip group">
		<div
			class="color"
			:style="`background: repeating-linear-gradient(0deg,transparent,transparent 4px,${track.color},4px,${track.color} 8px);`"
		/>
		<img src="@/assets/icons/play.svg" class="play" @mousedown="play(track)" />

		<div class="title">
			{{ clip ? clip.name : '' }}
		</div>
	</div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import GroupClip from '@/groupclip';
export default Vue.extend({
	props: {
		track: {
			type: Object,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
		clip: {
			type: GroupClip,
			default: undefined,
		},
	},
	methods: {
		play(parent) {
			for (const track of parent.subTracks) {
				if (track.clips[this.index]) {
					track.clips[this.index].play();
				}
				if (track.subTracks.length > 0) {
					this.play(track);
				}
			}
		},
	},
});
</script>

<style scoped lang="less">
.clip {
	background: repeating-linear-gradient(45deg, #505050, #505050 11px, #5a5a5a 11px, #5a5a5a 22px);
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
