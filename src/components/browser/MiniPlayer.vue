<template>
	<div class="miniplayer">
		<button class="autoplay" @click="autoplay = !autoplay" :class="{ checked: autoplay }">
			<img src="@/assets/icons/headphones.svg" />
		</button>
		<div class="canvascontainer">
			<canvas ref="canvas" />
		</div>
	</div>
</template>

<script>
import * as waveform from '@/waveform.js';
import { getProject } from '@/Project.vue';

import audioEngine, * as ae from '@/audioengine.js';

export default {
	components: {},
	props: {
		file: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			autoplay: false,
			height: 0,
			width: 0,
			playhead: 0,
			fileInfo: {},
			lineWidth: 2 * 0.75,
			margin: 2 * 0.75,
			waveformData: [],
			waveformWindow: 0,
		};
	},
	watch: {
		file(file) {
			this.openFile(file);
		},
		playhead(val) {
			this.draw();
		},
	},
	methods: {
		draw() {
			try {
				const canvas = this.$refs.canvas;
				const ctx = canvas.getContext('2d');

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				if (this.waveformData === null) {
					return;
				}

				const resolution = Math.floor(canvas.width / (this.lineWidth + this.margin));

				const optimalWindow = this.getOptimalWindow();
				if (this.waveformWindow != optimalWindow) {
					this.readFileWaveform(this.file);
					//return; // render 'SOMETING', it's better than nothing
				}

				ctx.fillStyle = '#0bcae6';
				for (let i = 0; i < resolution; i++) {
					if (i / resolution >= this.playhead) {
						ctx.fillStyle = '#b5b2b1';
					}
					const fragment = this.getWaveFragment(i, resolution);
					const valUpper = fragment.max;
					const valLower = fragment.min;
					let y = Math.floor((canvas.height / 2) * (1 - valUpper));
					let y2 = Math.floor(canvas.height / 2 + (canvas.height / 2) * -valLower);
					if (y === y2) {
						y -= 0.5;
					}
					ctx.fillRect(i * (this.lineWidth + this.margin), y, this.lineWidth, y2 - y);
				}
				// playhead
				ctx.fillStyle = '#0bcae677';
				ctx.fillRect(canvas.width * this.playhead, 4, 1, canvas.height - 8);
			} catch (e) {
				console.error(e);
			}
		},
		getWaveFragment(i, resolution) {
			try {
				const scale = this.fileInfo.frames / this.waveformWindow / resolution;
				// if (scale < 1) {
				// 	console.warn(
				// 		"Scale is less than 1, which is not handy for waveform display :-)"
				// 	);
				// }
				const slice = this.waveformData[0].slice(
					Math.floor(i * scale),
					Math.floor(i * scale + scale)
				);
				const val = slice.reduce(
					(acc, cur) => {
						return {
							min: Math.min(acc.min, cur.min),
							max: Math.max(acc.max, cur.max),
						};
					},
					{ min: 0, max: 0 }
				);
				//console.log(val)
				return val;
			} catch {
				return { min: 0, max: 0 };
			}
		},
		getOptimalWindow() {
			function nearestPowerOf2(n) {
				return 1 << (31 - Math.clz32(n));
			}

			const canvas = this.$refs.canvas;
			const resolution = Math.floor(canvas.width / (this.lineWidth + this.margin));
			return nearestPowerOf2(this.fileInfo.frames / resolution);
		},
		async readFileWaveform(file) {
			try {
				if (this.isOpening) {
					return;
				}
				this.isOpening = true;
				this.fileInfo = await ae.readAudioFileInfo(file);
				//console.log(this.fileInfo)
				const data = await waveform.requestWaveform(file, this.getOptimalWindow());
				//console.log("data", data);
				this.waveformData = data.waveformData;
				this.waveformWindow = data.waveformWindow;
				this.draw();
			} catch (e) {
				console.error(e);
				this.waveformData = null;
				this.waveformWindow = 0;
				this.draw();
			} finally {
				this.isOpening = false;
			}
		},
		async openFile(file) {
			this.readFileWaveform(file);

			const project = getProject(this);
			if (this.audioevent) {
				project.cueTrack.stopAudioEvent(this.audioevent);
			}
			this.audioevent = new audioEngine.AudioEvent('cue', file);
			project.cueTrack.playAudioEvent(this.audioevent);

			const timer = setInterval(() => {
				this.playhead = this.audioevent.lastFrameOffset / this.audioevent.totalFrames;
				if (this.playhead >= 0.95) {
					this.playhead = 1;
					clearInterval(timer);
				}
			}, 1000 / 30);
		},
	},
	mounted() {
		const canvas = this.$refs.canvas;
		const self = this;
		new ResizeObserver(entries => {
			var parent = canvas.parentNode,
				styles = getComputedStyle(parent),
				w = parseInt(styles.getPropertyValue('width'), 10),
				h = parseInt(styles.getPropertyValue('height'), 10);

			canvas.width = w;
			canvas.height = h;

			self.draw();
		}).observe(this.$el);

		this.openFile(this.file);
	},
	beforeDestroy() {
		if (this.audioevent) {
			const project = getProject(this);
			project.cueTrack.stopAudioEvent(this.audioevent);
		}
	},
};
</script>

<style lang="less">
.miniplayer {
	flex: 0;
	flex-basis: 48px;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	background: #505050;
	border: 1px solid #353535;
	border-bottom: 0;
	border-right: 0;

	.autoplay {
		padding: 4px 10px;
		margin: 13px;
		height: 22px;
		line-height: 10px;

		img {
			width: 12px;
			height: 12px;
		}
	}

	.canvascontainer {
		flex: 1 1;
		overflow: hidden;
		margin: 5px 10px 5px 0;
	}
}
</style>
