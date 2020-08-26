<template>
	<div class="item" :class="{ disabled: disabled }" @click="$emit('click')">
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style scoped lang="less">
.item {
	display: inline-block;
	font-size: 15px;
	font-weight: 500; // PS medium
	margin-right: 24px;

	&:last-child {
		margin-right: 0;
	}
}
</style>
