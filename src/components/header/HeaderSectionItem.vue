<template>
	<div class="item" :class="{ disabled: disabled }" @click="$emit('click')">
		<slot />
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import 'vue-class-component/hooks';

@Component
export default class HeaderSectionItem extends Vue {
	@Prop({ default: false }) disabled!: boolean;
}
</script>

<style scoped lang="less">
.item {
	display: inline-block;
	font-size: 15px;
	font-weight: 500; // PS medium
	margin-right: 24px;
	height: 17px;

	svg {
		vertical-align: bottom;
	}

	img {
		height: 15px;
		vertical-align: bottom;

		&.selected {
			filter: invert(1) saturate(30.2) hue-rotate(-155deg) brightness(2.9);
		}

		&.button {
			&:hover {
				transform: scale(1.2);
			}
		}
	}

	&:last-child {
		margin-right: 0;
	}
}
</style>
