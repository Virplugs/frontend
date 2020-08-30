<template>
	<div
		class="volume"
		tabindex="0"
		@mousedown="startdrag($event)"
		@dblclick="setDefaultValue"
		@focus="draw(false)"
		@blur="draw(false)"
		@wheel.prevent="wheel($event)"
	>
		<canvas ref="canvas" />
	</div>
</template>

<script lang="ts">
import { dBFS2sample } from '@/units';
import Track from '@/track';

import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';

function leftPointingTriangle(
	ctx: CanvasRenderingContext2D,
	pointX: number,
	pointY: number,
	width: number
) {
	ctx.beginPath();
	ctx.moveTo(pointX, pointY);
	ctx.lineTo(pointX + width, pointY - width);
	ctx.lineTo(pointX + width, pointY + width);
	ctx.closePath();
}

@Component
export default class Volume extends Vue {
	indicators = [6, -0, -6, -12, -18, -26, -36, -50, -72].map(i => {
		return {
			dBFS: i,
			d: dBFS2sample(i),
		};
	});

	mapFn = (d: number) => Math.pow(d, 1 / 4);
	inf = this.mapFn(dBFS2sample(-72));
	max = this.mapFn(dBFS2sample(6));
	scaleFn = (d: number) => 1 - (this.mapFn(d) - this.inf) / (this.max - this.inf);
	ctx!: CanvasRenderingContext2D;
	meterHeight!: number;
	noiseFloor = dBFS2sample(-72);

	@Prop({ default: 1 }) value!: number;
	@Prop({ required: true }) track!: Track;
	@Prop({ default: 0.025 }) acceleration!: number;
	@Prop({ default: 1 }) defaultValue!: number;
	@Prop({ default: '#ffc907' }) handleColor!: string;

	public $refs!: {
		canvas: HTMLCanvasElement;
	};

	@Watch('value') onValueChanged(val: number) {
		this.draw();
	}

	drawMeter(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		peaklevel: number,
		rmslevel: number,
		standingpeak: number
	) {
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
		ctx.fillRect(x, y, 1, 1);
		ctx.fillRect(x, y + h - 1, 1, 1);
		ctx.fillRect(x + w - 1, y, 1, 1);
		ctx.fillRect(x + w - 1, y + h - 1, 1, 1);
	}

	draw(onlyMeters = false) {
		try {
			if (!onlyMeters) {
				this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
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
					this.ctx.font = '300 22px Ubuntu';
					this.ctx.fillRect(33, 8 + relative * h - 4, 6, 1);
					this.ctx.fillText('\u221E', 42, 4 + relative * h + 3);
				} else if (relative === 0) {
					// boost
					this.ctx.font = '500 11px Ubuntu';
					this.ctx.fillRect(33, relative * h + 4, 6, 1);
					this.ctx.fillText(
						Math.abs(indicator.dBFS).toString(),
						42,
						4 + relative * h + 7
					);
				} else {
					// scale
					this.ctx.font = '500 11px Ubuntu';
					this.ctx.fillRect(33, 4 + relative * h + 1, 6, 1);
					this.ctx.fillText(
						Math.abs(indicator.dBFS).toString(),
						42,
						4 + relative * h + 5
					);
				}
			}

			// arrow
			const arrowRelative = Math.min(1, this.scaleFn(this.track.nativeTrack.volume));
			leftPointingTriangle(this.ctx, 39, 4 + arrowRelative * h + 1, 10);
			this.ctx.fillStyle = this.handleColor;
			this.ctx.fill();
		} catch (e) {
			console.warn(e);
		}
	}

	lastmousedown = 0;
	lastdblclick = 0;
	startdrag($event: MouseEvent) {
		const doubleclickSpeed = 300;
		const now = new Date().getTime();
		if (now - this.lastdblclick <= doubleclickSpeed) {
			// Triple click
			console.log('tripleclick');
			this.lastdblclick = now;
			this.lastmousedown = now;
			return;
		}
		if (now - this.lastmousedown <= doubleclickSpeed) {
			// Double click
			this.setDefaultValue();
			this.lastdblclick = now;
			this.lastmousedown = now;
			return;
		} else {
			// Single click
			this.lastmousedown = now;
		}

		this.$el.requestPointerLock();
	}

	pointerlockchange(e: Event) {
		if (document.pointerLockElement === this.$el) {
			// console.log('The pointer lock status is now locked');
			document.addEventListener('mousemove', this.updatePosition, false);
			document.addEventListener('mouseup', this.enddrag, false);
			document.addEventListener('dblclick', this.setDefaultValue, false);
		} else {
			// console.log('The pointer lock status is now unlocked');
			document.removeEventListener('mousemove', this.updatePosition, false);
			document.removeEventListener('mouseup', this.enddrag, false);
			document.removeEventListener('dblclick', this.setDefaultValue, false);
		}
	}

	enddrag($event: MouseEvent) {
		document.exitPointerLock();
	}

	updatePosition(e: MouseEvent) {
		const currentVolume = this.track.nativeTrack.volume;
		if (
			e.movementY != 0 &&
			(e.movementY < 0 || currentVolume > 0) &&
			(e.movementY > 0 || currentVolume < 2)
		) {
			const precisionAcceleration = e.shiftKey ? 0.1 : 1;
			let newVal =
				Math.max(this.noiseFloor, currentVolume) -
				e.movementY *
					Math.max(this.noiseFloor, Math.pow(currentVolume, 0.75)) *
					this.acceleration *
					precisionAcceleration;
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
	}

	wheel($event: WheelEvent) {
		const currentVolume = this.track.nativeTrack.volume;
		const precisionAcceleration = $event.shiftKey ? 0.1 : 1;
		let newVal =
			Math.max(this.noiseFloor, currentVolume) -
			($event.deltaY / 25) *
				Math.max(this.noiseFloor, Math.pow(currentVolume, 0.75)) *
				this.acceleration *
				precisionAcceleration;
		newVal = Math.max(0, Math.min(2, newVal));
		if (newVal < this.noiseFloor) {
			newVal = 0;
		}
		if (newVal !== currentVolume) {
			this.$emit('input', newVal);
			this.track.nativeTrack.volume = newVal;
			window.requestAnimationFrame(() => {
				this.draw();
			});
		}
	}

	setDefaultValue() {
		this.$emit('input', this.defaultValue);
		this.track.nativeTrack.volume = this.defaultValue;
		this.draw();
	}

	mounted() {
		this.ctx = this.$refs.canvas.getContext('2d')!;
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
		const parent: Element = this.$refs.canvas.parentNode as Element;
		const styles = getComputedStyle(parent);
		const w = parseInt(styles.getPropertyValue('width'), 10);
		const h = parseInt(styles.getPropertyValue('height'), 10);

		this.$refs.canvas.width = w;
		this.$refs.canvas.height = h;

		this.meterHeight = this.$refs.canvas.height - 8;

		document.addEventListener('pointerlockchange', this.pointerlockchange, false);
		(document as any).fonts.ready.then(() => this.draw(false));

		const animFrameFn = (timestamp: number) => {
			if (this.isDestroyed) {
				return;
			}
			setTimeout(() => {
				this.draw(true);
				window.requestAnimationFrame(animFrameFn);
			}, 1000 / 33);
		};
		window.requestAnimationFrame(animFrameFn);

		// setTimeout(() => {
		// 		this.draw(false);
		// 	}, 100);
	}

	isDestroyed = false;
	beforeDestroy() {
		document.removeEventListener('pointerlockchange', this.pointerlockchange, false);
		this.isDestroyed = true;
		//this.resizeObserver.disconnect();
	}
}
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
