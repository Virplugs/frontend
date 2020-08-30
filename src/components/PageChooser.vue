<template>
	<div class="page-chooser">
		<div class="tabs">
			<div class="head-title" v-if="showHeaders">
				{{ mainHeader }}
			</div>
			<ul>
				<li
					v-for="slot in $slots.default"
					:key="slot.key"
					:class="{
						selected:
							slot &&
							currentSlot &&
							slot.data.attrs.title === currentSlot.data.attrs.title,
					}"
					@click="currentSlot = slot"
				>
					{{ slot ? slot.data.attrs.title : '' }}
				</li>
			</ul>
		</div>
		<div class="content">
			<div class="head-title" v-if="showHeaders">
				{{ currentSlot ? currentSlot.data.attrs.title : '' }}
			</div>

			<div class="page">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';

@Component
export default class PageChooser extends Vue {
	currentSlot: Vue.VNode | undefined | null = null;
	hasFocus = false;

	@Prop({ default: true }) showHeaders!: boolean;
	@Prop({ default: 'Configuration' }) mainHeader!: string;

	@Watch('currentSlot')
	onCurrentSlotChanged(newSlot?: Vue.VNode, oldSlot?: Vue.VNode) {
		if (oldSlot) {
			if (oldSlot?.elm) {
				(oldSlot.elm as HTMLElement).style.display = 'none';
			}
		}
		if (newSlot) {
			if (newSlot?.elm) {
				(newSlot.elm as HTMLElement).style.display = '';
			}
		}
	}

	focusIn(event: Event) {
		this.hasFocus = true;
	}

	focusOut(event: Event) {
		this.hasFocus = false;
	}

	mounted() {
		this.$nextTick(() => {
			this.currentSlot = this.$slots?.default ? this.$slots?.default[0] : null;
			if (this.$slots?.default) {
				for (let slot of this.$slots?.default) {
					if (slot !== this.currentSlot) {
						if (slot?.elm) {
							(slot.elm as HTMLElement).style.display = 'none';
						}
					}
				}
			}
		});
		// console.dir(this.currentSlot);

		this.$el.addEventListener('focusin', this.focusIn);
		this.$el.addEventListener('focusout', this.focusOut);
	}
	beforeDestroy() {
		this.$el.removeEventListener('focusin', this.focusIn);
		this.$el.removeEventListener('focusout', this.focusOut);
	}
}
</script>

<style scoped lang="less">
@import '../styles/vars.less';

.page-chooser {
	background: transparent;
	display: flex;
	flex-direction: row;
	position: relative;
	min-height: 0;
	flex: 1;
}

.tabs {
	flex: 0 0 200px;
	margin-right: 4px;
	background: #353535;
	margin-top: 32px;
	padding: 2px;
	display: flex;

	ul {
		display: block;
		flex: 2 0;
		padding: 0;
		overflow-x: hidden;
		margin: 0;
		font-size: 14px;
		overflow-y: scroll;

		li {
			display: block;
			padding: 4px 8px;

			&:hover {
				background: rgba(255, 255, 255, 0.03);
			}

			&.selected {
				background: #202020;
			}
		}
	}
}

.head-title {
	height: 32px;
	line-height: 32px;
	font-size: 14px;
	padding: 0 8px;
	color: white;
	box-sizing: border-box;
	font-weight: 300;
	position: absolute;
	top: 0;
}

.content {
	flex: 2;
	background: #353535;
	margin-top: 32px;
	display: flex;

	> .page {
		flex: 1;
		overflow: hidden;
		display: flex;
	}
}
</style>
