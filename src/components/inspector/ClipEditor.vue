<template>
	<div class="clipeditor" :style="`--color: ${clip.color}`" v-if="isClip">
		<section style="width: 150px;" class="clip">
			<header>Clip</header>
			<main>
				<input v-model="clip.name" @focus="$event.target.select()" />
				<div class="color" style="background: var(--color);" />
			</main>
		</section>

		<section style="width: 360px;" v-if="isAudioClip" class="audioclip">
			<header>Sample</header>
			<main style="flex-direction: row;">
				<div class="row" style="flex: 1.5;">
					<div>drumLoop.wav</div>
					<div>44.1 kHz 16 Bit 2 Ch</div>
					<div />
					<div class="buttonrow">
						<button>Edit</button>
						<button>Save</button>
						<button>Rev.</button>
					</div>
					<div class="buttonrow">
						<button>HiQ</button>
						<button class="checked">Fade</button>
						<button>RAM</button>
					</div>
					<div />
					<div class="buttonrow">
						<knob
							title="Transpose"
							:isOffset="true"
							v-model="someValue"
							:min="-48"
							:max="48"
							:step-size="1"
							:acceleration="0.1"
							:value-display-function="v => `${v} st`"
						/>
						<knob
							title="Gain"
							:isOffset="true"
							v-model="gainScaled"
							:min="-1"
							:max="1"
							:default-value="0"
							:value-display-function="v => showScaleddBFS(v, 24)"
						/>
					</div>
				</div>
				<div class="row">
					<button class="checked">Loop</button>
					<div style="height: 14px;"></div>
					<div>Clip BPM</div>
					<input value="120" />
					<div class="buttonrow">
						<button>&divide; 2</button>
						<button>&times; 2</button>
					</div>
				</div>
				<div class="row">
					<button class="checked">Warp</button>
				</div>
			</main>
		</section>

		<div class="editor"></div>
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';
import Clip, { AudioClip } from '@/clip';
import Knob from '@/components/Knob.vue';
import { sample2dBFS, dBFS2sample, scaleTodBFS, dBFSToScale } from '@/units';
@Component({
	components: {
		Knob,
	},
})
export default class ClipEditor extends Vue {
	@Prop({ required: true }) clip!: Clip;

	someValue = 0;
	gainScaled = 0;

	@Watch('gainScaled') scaledGainChanged(val: number) {
		(this.clip as AudioClip).nativeAudioEvent.gain = dBFS2sample(scaleTodBFS(val, 24));
	}

	get isClip() {
		return this.clip instanceof Clip;
	}

	get isAudioClip() {
		return this.clip instanceof AudioClip;
	}

	showScaleddBFS(v: number, max: number) {
		v = scaleTodBFS(v, max);
		if (v < -72) {
			return '-\u221E dB';
		} else {
			return `${v.toFixed(1)} dB`;
		}
	}

	mounted() {
		if (this.clip instanceof AudioClip) {
			this.gainScaled = dBFSToScale(sample2dBFS(this.clip.nativeAudioEvent.gain), 24);
		}
	}
}
</script>

<style scoped lang="less">
.clipeditor {
	display: flex;
	flex: 1;
	background: #202020;

	section {
		background: #505050;
		font-size: 13px;
		margin-right: 4px;
		display: flex;
		flex-direction: column;

		header {
			background: #202020;
			height: 16px;
			line-height: 16px;
			padding: 6px 12px;
		}

		main {
			padding: 6px;
			display: flex;
			flex-direction: column;

			input {
				text-align: center;
				padding: 4px;
				font-size: 12px;
				font-weight: 500;
				width: 100%;
				box-sizing: border-box;
				display: block;
			}
		}
	}

	.clip {
		.color {
			margin-top: 4px;
			height: 16px;
			border: 3px solid #303030;
		}
	}

	.editor {
		flex-grow: 2;
		background: #505050;
	}

	.row {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-right: 16px;

		&:last-child {
			margin-right: 0;
		}

		button {
			padding: 2px;
			font-size: 12px;
		}

		> * {
			margin-bottom: 4px;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.buttonrow {
		display: flex;

		> * {
			flex: 1 1;
			margin-right: 4px;

			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
