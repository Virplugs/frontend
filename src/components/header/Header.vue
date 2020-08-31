<template>
	<header>
		<header-section title="Tempo">
			<header-section-item>LINK</header-section-item>
			<header-section-item>TAP</header-section-item>
		</header-section>

		<header-section title="Transport">
			<header-section-item><img src="@/assets/icons/follow.svg" /></header-section-item>
			<header-section-item>
				<span class="musicaltiming">{{ bars }}</span>
				<span class="musicaltiming">{{ beats }}</span>
				<span class="musicaltiming">{{ sixteenths }}</span>
			</header-section-item>
			<header-section-item>
				<img
					src="@/assets/icons/transport_play.svg"
					class="button"
					:class="{ selected: isPlaying }"
					@mousedown="start"
				/>
			</header-section-item>
			<header-section-item>
				<img src="@/assets/icons/transport_stop.svg" class="button" @mousedown="stop" />
			</header-section-item>
			<header-section-item>
				<img src="@/assets/icons/transport_record.svg" />
			</header-section-item>
			<header-section-item>
				<img src="@/assets/icons/transport_overdub.svg" />
			</header-section-item>
		</header-section>

		<header-section title="Status">
			<header-section-item>
				CPU
				<svg
					class="meter"
					width="5"
					height="17"
					v-for="(u, index) of cpuUsages"
					:key="index"
				>
					<clipPath id="clip">
						<rect rx="2" ry="2" width="4" height="17" />
					</clipPath>
					<rect fill="#5a5a5a" width="4" height="17" clip-path="url(#clip)" />
					<rect
						:fill="u.average > 0.9 ? '#FD1200' : '#ffc907'"
						rx="2"
						ry="2"
						width="4"
						height="17"
						:style="`transform: scaleY(${u.average});`"
						clip-path="url(#clip)"
					/>
				</svg>
			</header-section-item>
		</header-section>
	</header>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import HeaderSection from './HeaderSection.vue';
import HeaderSectionItem from './HeaderSectionItem.vue';
import { getProject } from '@/project';
import { requestCPUUpdates } from '@/systemstats';

@Component({
	components: {
		HeaderSection,
		HeaderSectionItem,
	},
})
export default class Header extends Vue {
	bars = 1;
	beats = 1;
	sixteenths = 1;

	cpuUsage = 0;
	cpuUsages: {
		total: number;
		idle: number;
		average: number;
	}[] = [];

	isDestroyed = false;

	isPlaying = false;

	mounted() {
		this.$root.$on('transportUpdated', (data: any) => {
			this.bars = Math.floor(data.projectTimeMusicBars) + 1;
			this.beats = (Math.floor(data.projectTimeMusic) % 4) + 1;
			this.sixteenths = (Math.floor(data.projectTimeMusic * 4) % 4) + 1;
		});
		this.$root.$on('transportIsPlaying', (isPlaying: boolean) => {
			this.isPlaying = isPlaying;
		});

		requestCPUUpdates(avg => {
			const worst = avg.reduce((acc, cur) => (cur.average > acc ? cur.average : acc), 0);
			// console.log(worst);
			this.cpuUsages = avg;
			this.cpuUsage = worst;
			return !this.isDestroyed;
		});
	}

	beforeDestroy() {
		this.isDestroyed = true;
	}

	start() {
		getProject().transport.start();
	}

	stop() {
		getProject().transport.stop();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
header {
	background: #202020;
	height: 96px;

	.musicaltiming {
		min-width: 22px;
		display: inline-block;
		text-align: right;
		margin-right: 4px;
		position: relative;

		&::after {
			content: '.';
			position: absolute;
			width: 2px;
			right: -4px;
			height: 100%;
		}

		&:last-child::after {
			content: '';
		}
	}

	.meter {
		margin-left: 4px;
		transform: scaleY(-1);
		transform-origin: 50% 50%;
		border-radius: 3px;
		clip-path: url(#clip);

		rect {
			transition: all 1s ease-in-out;
		}
	}
}
</style>
