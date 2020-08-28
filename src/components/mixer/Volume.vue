<template>
	<div
		class="volume"
		tabindex="0"
		@mousedown="startdrag($event)"
		@mouseup="enddrag($event)"
		@dblclick="setDefaultValue"
		@focus="draw(false)"
		@blur="draw(false)"
		@wheel.prevent="wheel($event)"
	>
		<canvas ref="canvas" />
	</div>
</template>

<script>
import { sample2dBFS, dBFS2sample } from '@/units';
import Track from '@/track';

const robotjs = require('robotjs');

function roundRect(ctx, x, y, w, h, r) {
	if (w < 2 * r) {r = w / 2;}
	if (h < 2 * r) {r = h / 2;}
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y,   x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x,   y+h, r);
	ctx.arcTo(x,   y+h, x,   y,   r);
	ctx.arcTo(x,   y,   x+w, y,   r);
	ctx.closePath();
}

function leftPointingTriangle(ctx, pointX, pointY, width) {
	ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX + width, pointY - width);
    ctx.lineTo(pointX + width, pointY + width);
	ctx.closePath();
}


export default {
	data() {
		const indicators = [6, -0, -6, -12, -18, -26, -36, -50, -72];

		const mapFn = d => Math.pow(d, 1/4);
		const inf = mapFn(dBFS2sample(-72));
		const max = mapFn(dBFS2sample(6));
		const scaleFn = d => 1 - ((mapFn(d) - inf) / (max - inf));
		return {
			scaleFn,
			indicators: indicators.map(i => {
				return {
					dBFS: i,
					d: dBFS2sample(i)
				};
			}),
		};
	},
	props: {
		value: {
			type: Number,
			default: 1,
		},
		track: {
			type: Track,
			required: true,
		},
		acceleration: {
			type: Number,
			default: 0.025,
		},
		defaultValue: {
			type: Number,
			default: 1,
		},
		handleColor: {
			type: String,
			default: '#ffc907',
		},
	},
	watch: {
		value(val) {
			this.draw();
		},
	},
	methods: {
		drawMeter(ctx, x, y, w, h, peaklevel, rmslevel, standingpeak) {
			peaklevel = 1 - this.scaleFn(peaklevel);
			rmslevel = 1 - this.scaleFn(rmslevel);
			standingpeak = 1 - this.scaleFn(standingpeak);
			// background
			ctx.fillStyle = '#353535';
			//roundRect(ctx, x, y, w, h, 3);
			// ctx.fill();
			ctx.fillRect(x, y, w, h);
			// rmslevel
			if (rmslevel > 0) {
				ctx.fillStyle = '#2a5639';
				//roundRect(ctx, x, y + h - rmslevel * h, w, rmslevel * h, 3);
				//ctx.fill();
				ctx.fillRect(x, y + h - rmslevel * h, w, rmslevel * h);
			}
			// peaklevel
			if (peaklevel > 0) {
				ctx.fillStyle = '#00da48';
				//roundRect(ctx, x, y + h - peaklevel * h, w, peaklevel * h, 3);
				//ctx.fill();
				ctx.fillRect(x, y + h - peaklevel * h, w, peaklevel * h);
			}
			// zero
			ctx.fillStyle = '#505050';
			ctx.fillRect(x, y + this.scaleFn(1) * h, w, 2);
			// standingpeak
			if (standingpeak > 0) {
				ctx.fillStyle = '#00da48';
				ctx.fillRect(x, y + h - standingpeak * h, w, 1);
			}

			ctx.fillStyle = '#505050';
			this.ctx.fillRect(x, y, 1, 1);
			this.ctx.fillRect(x, y + h - 1, 1, 1);
			this.ctx.fillRect(x + w - 1, y, 1, 1);
			this.ctx.fillRect(x + w - 1, y + h - 1, 1, 1);
		},
		draw(onlyMeters = false) {
			try {
			if (!onlyMeters) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			}

			const levels = this.track.nativeTrack.levels;
			const h = this.meterHeight;

			this.drawMeter(this.ctx, 4, 4, 10, h, levels[0], 0, 0);
			this.drawMeter(this.ctx, 18, 4, 10, h, levels[1], 0, 0);

			if (onlyMeters) {
				return;
			}

			for (const indicator of this.indicators) {
				const relative = this.scaleFn(indicator.d);

				this.ctx.fillStyle = '#202020';
				if (relative === 1) {
					// inf
					this.ctx.font = "300 22px Ubuntu";
					this.ctx.fillRect(33, 8 + relative * h - 4, 6, 1);
					this.ctx.fillText('\u221E', 42, 4 + relative * h + 3);
				} else if (relative === 0) {
					// boost
					this.ctx.font = "500 11px Ubuntu";
					this.ctx.fillRect(33, relative * h + 4, 6, 1);
					this.ctx.fillText(Math.abs(indicator.dBFS), 42, 4 + relative * h + 7);
				} else {
					// scale
					this.ctx.font = "500 11px Ubuntu";
					this.ctx.fillRect(33, 4 + relative * h + 1, 6, 1);
					this.ctx.fillText(Math.abs(indicator.dBFS), 42, 4 + relative * h + 5);
				}
			}

			// arrow
			const arrowRelative = Math.min(1, this.scaleFn(this.track.nativeTrack.volume));
			leftPointingTriangle(this.ctx, 39, 4 + arrowRelative * (h) + 1, 10);
			this.ctx.fillStyle = this.handleColor;
			this.ctx.fill();

			} catch(e) {
				console.warn(e);
			}
		},
		startdrag($event) {
			this.isDragging = true;
			this.startScreenX = $event.screenX;
			this.startScreenY = $event.screenY;
			this.dragStartValue = this.track.nativeTrack.volume;
			this.dy = 0;
			document.body.classList.add('volume__hidecursor');
		},
		enddrag($event) {
			this.isDragging = false;

			document.body.classList.remove('volume__hidecursor');
		},
		documentMouseMove(e) {
			if (this.isDragging) {
				if (this.ignoreNextMouseMove) {
					this.ignoreNextMouseMove = false;
					return;
				}
				const currentVolume = this.track.nativeTrack.volume;
				const dy = e.screenY - this.startScreenY;
				if (
					dy != 0 &&
					(dy < 0 || currentVolume > 0) &&
					(dy > 0 || currentVolume < 2)
				) {
					const precisionAcceleration = e.shiftKey ? 0.1 : 1;
					let newVal = Math.max(this.noiseFloor, currentVolume) - dy
						* Math.max(this.noiseFloor, Math.pow(currentVolume, 0.75))
						* this.acceleration * precisionAcceleration;
					newVal = Math.max(0, Math.min(2, newVal));
					if (newVal < this.noiseFloor) {
						newVal = 0;
					}
					if (newVal !== currentVolume) {
						this.$emit('input', newVal);
						this.track.nativeTrack.volume = newVal;
						this.draw();
					}
				}
				this.ignoreNextMouseMove = true;
				robotjs.moveMouse(this.startScreenX, this.startScreenY);
			}
		},
		wheel($event) {
			const currentVolume = this.track.nativeTrack.volume;
			const precisionAcceleration = $event.shiftKey ? 0.1 : 1;
			let newVal = Math.max(this.noiseFloor, currentVolume) - ($event.deltaY/25)
				* Math.max(this.noiseFloor, Math.pow(currentVolume, 0.75))
				* this.acceleration * precisionAcceleration;
			newVal = Math.max(0, Math.min(2, newVal));
			if (newVal < this.noiseFloor) {
				newVal = 0;
			}
			if (newVal !== currentVolume) {
				this.$emit('input', newVal);
				this.track.nativeTrack.volume = newVal;
				this.draw();
			}
		},
		setDefaultValue() {
			this.$emit('input', this.defaultValue);
			this.track.nativeTrack.volume = this.defaultValue;
			this.draw();
		}
	},
	mounted() {
		const self = this;
		this.canvas = self.$refs.canvas;
		this.ctx = this.canvas.getContext('2d');
		/*self.resizeObserver = new ResizeObserver(entries => {
			var parent = canvas.parentNode,
				styles = getComputedStyle(parent),
				w = parseInt(styles.getPropertyValue('width'), 10),
				h = parseInt(styles.getPropertyValue('height'), 10);

			canvas.width = w;
			canvas.height = h;

			self.draw();
		});
		self.resizeObserver.observe(this.$el);*/
		var parent = this.canvas.parentNode,
			styles = getComputedStyle(parent),
			w = parseInt(styles.getPropertyValue('width'), 10),
			h = parseInt(styles.getPropertyValue('height'), 10);

		this.canvas.width = w;
		this.canvas.height = h;

		this.meterHeight = (this.canvas.height - 8);

		this.noiseFloor = dBFS2sample(-72);

		document.addEventListener('mousemove', this.documentMouseMove);
		document.fonts.ready.then(()=>this.draw(false));

		const animFrameFn = (timestamp) => {
			if (this.destroyed) {
				return;
			}
			setTimeout(() => {
				this.draw(true);
				window.requestAnimationFrame(animFrameFn);
			}, 1000/33);
		};
		window.requestAnimationFrame(animFrameFn);

		// setTimeout(() => {
		// 		this.draw(false);
		// 	}, 100);
	},
	beforeDestroy() {
		document.removeEventListener('mousemove', this.documentMouseMove);
		this.destroyed = true;
		//this.resizeObserver.disconnect();
	},
};
</script>

<style scoped lang="less">
.volume {
	/* prettier-ignore */
	overflow: hidden;
	height: 100%;
	display: flex;

	&:focus {
		outline: none;
		background:
			linear-gradient(to right, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 0 0,
			linear-gradient(to right, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 0 100%,
			linear-gradient(to left, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 100% 0,
			linear-gradient(to left, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 100% 100%,
			linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 0 0,
			linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 100% 0,
			linear-gradient(to top, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 0 100%,
			linear-gradient(to top, rgba(0, 0, 0, 0.4) 1px, transparent 1px) 100% 100%;
		background-repeat: no-repeat;
		background-size: 8px 8px;
	}
}
</style>

<style lang="less">
.volume__hidecursor,
.volume__hidecursor * {
	cursor: none !important;
}
</style>
