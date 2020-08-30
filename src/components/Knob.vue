<template>
	<div class="knob" tabindex="0">
		<div class="title" v-if="title">
			{{ title }}
		</div>
		<svg
			class="progress-ring"
			width="40"
			height="40"
			@mousedown="startdrag($event)"
			@mouseup="enddrag($event)"
			@dblclick="setDefaultValue"
			@wheel.prevent="wheel($event)"
		>
			<circle
				ref="track"
				class="progress-ring__track"
				:stroke="trackColor"
				stroke-width="3.5"
				fill="transparent"
				r="18"
				cx="20"
				cy="20"
				stroke-linecap="round"
			/>
			<circle
				ref="progress"
				class="progress-ring__progress"
				:stroke="color"
				stroke-width="3.5"
				fill="transparent"
				r="18"
				cx="20"
				cy="20"
				stroke-linecap="round"
			/>
		</svg>
		<div class="value" v-if="showValue">
			{{ valueDisplayFunction(value) }}
		</div>
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import robotjs = require('robotjs');

@Component
export default class Knob extends Vue {
	circumference = 0;
	circumferenceMinusOpening = 0;
	isDragging = false;
	dy = 0;
	dragStartValue = 0;

	@Prop({ required: true }) value!: number;
	@Prop({ default: 100 }) max!: number;
	@Prop({ default: 0 }) min!: number;
	@Prop({ default: 0 }) stepSize!: number;
	@Prop({ default: 0.5 }) acceleration!: number;
	@Prop({ default: false }) disabled!: boolean;
	@Prop({ default: '#ffc907' }) color!: string;
	@Prop({ default: '#353535' }) trackColor!: string;
	@Prop({ default: '' }) title!: string;
	@Prop({ default: true }) showValue!: boolean;
	@Prop({ default: (v: number) => v }) valueDisplayFunction!: (value: number) => any;
	@Prop({ default: false }) isOffset!: boolean;
	@Prop({ default: 0 }) defaultValue!: number;

	public $refs!: {
		track: SVGCircleElement;
		progress: SVGCircleElement;
	};

	@Watch('value') onValueChanged(val: number) {
		this.setValue(val);
	}

	get relativeAcceleration() {
		return this.acceleration * ((this.max - this.min) / 100);
	}

	setValue(val: number) {
		if (this.isOffset) {
			const offset =
				this.circumference -
				((val - this.min) / (this.max - this.min) - 0.5) * this.circumferenceMinusOpening;
			this.$refs.progress.style.strokeDashoffset = offset.toString();
			if (Math.abs(this.circumference - +this.$refs.progress.style.strokeDashoffset) < 1) {
				this.$refs.progress.style.strokeDashoffset = (this.circumference - 1).toString();
				this.$refs.progress.style.transform = `rotate(-91deg)`;
			} else {
				this.$refs.progress.style.transform = `rotate(-90deg)`;
			}
		} else {
			const offset =
				this.circumference -
				((val - this.min) / (this.max - this.min)) * this.circumferenceMinusOpening;
			this.$refs.progress.style.strokeDashoffset = offset.toString();
		}
	}
	startScreenX = 0;
	startScreenY = 0;
	startdrag($event: MouseEvent) {
		this.isDragging = true;
		this.startScreenX = $event.screenX;
		this.startScreenY = $event.screenY;
		this.dragStartValue = this.value;
		this.dy = 0;
		document.body.classList.add('knob__hidecursor');
	}
	enddrag($event: MouseEvent) {
		this.isDragging = false;

		document.body.classList.remove('knob__hidecursor');
	}

	ignoreNextMouseMove = false;
	documentMouseMove(e: MouseEvent) {
		if (this.isDragging) {
			if (this.ignoreNextMouseMove) {
				this.ignoreNextMouseMove = false;
				return;
			}
			const dy = e.screenY - this.startScreenY;
			if (dy != 0 && (dy < 0 || this.value > this.min) && (dy > 0 || this.value < this.max)) {
				const precisionAcceleration = e.shiftKey ? 0.1 : 1;
				this.dy -= dy * precisionAcceleration;
				let newVal = Math.max(
					this.min,
					Math.min(this.max, this.dragStartValue + this.dy * this.relativeAcceleration)
				);
				if (this.stepSize) {
					newVal = newVal - (newVal % this.stepSize);
				}
				if (newVal !== this.value) {
					this.$emit('input', newVal);
					this.setValue(newVal);
				}
			}
			this.ignoreNextMouseMove = true;
			robotjs.moveMouse(this.startScreenX, this.startScreenY);
		}
	}
	wheel($event: WheelEvent) {
		const precisionAcceleration = $event.shiftKey ? 0.1 : 1;
		let newVal = Math.max(
			this.min,
			Math.min(
				this.max,
				this.value -
					($event.deltaY / 10) * precisionAcceleration * this.relativeAcceleration
			)
		);
		if (this.stepSize) {
			newVal = newVal - (newVal % this.stepSize);
		}
		if (newVal !== this.value) {
			this.$emit('input', newVal);
			this.setValue(newVal);
		}
	}
	setDefaultValue() {
		this.$emit('input', this.defaultValue);
		this.setValue(this.defaultValue);
	}

	mounted() {
		const opening = 90;

		const track = this.$refs.track;
		const radius = track.r.baseVal.value;
		this.circumference = radius * 2 * Math.PI;
		this.circumferenceMinusOpening = this.circumference * ((360 - opening) / 360.0);

		track.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
		track.style.strokeDashoffset = this.circumference.toString();
		track.style.transform = `rotate(${90 + opening / 2}deg)`;
		track.style.strokeDashoffset = (
			this.circumference - this.circumferenceMinusOpening
		).toString();

		const progress = this.$refs.progress;
		progress.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
		progress.style.strokeDashoffset = this.circumference.toString();
		if (this.isOffset) {
			progress.style.transform = `rotate(-90deg)`;
		} else {
			progress.style.transform = `rotate(${90 + opening / 2}deg)`;
		}

		this.setValue(this.value);

		document.addEventListener('mousemove', this.documentMouseMove);
	}

	beforeDestroy() {
		document.removeEventListener('mousemove', this.documentMouseMove);
	}
}
</script>

<style scoped lang="less">
.knob {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	position: relative;
	font-size: 13px;
	color: #b5b2b1;
	flex-direction: column;
	text-align: center;
	padding: 3px;

	/* prettier-ignore */
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

	.title {
		margin-bottom: 6px;
		font-weight: 500;
	}

	.progress-ring {
		margin-bottom: -5px;
	}

	.value {
		margin-top: 4px;
	}
}

.progress-ring__track,
.progress-ring__progress {
	transform-origin: 50% 50%;
	//transition: stroke-dashoffset 0.05s;
}
</style>

<style lang="less">
.knob__hidecursor,
.knob__hidecursor * {
	cursor: none !important;
}
</style>
