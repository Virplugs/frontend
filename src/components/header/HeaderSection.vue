<template>
	<section>
		<h1>{{ title }}</h1>
		<hr>
		<div class="items">
			<slot />
		</div>
	</section>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		}
	}
}
</script>

<style scoped lang="less">
	section {
		float: left;
		height: 96px;
		color: #b5b2b1;
		margin: 0 22px;
		padding: 27px 0;
		box-sizing: border-box;

		h1 {
			text-transform: uppercase;
			font-size: 12px;
			font-weight: normal;
			margin: 0;
			padding: 0;
		}

		hr {
			background: #b5b2b1;
			height: 1px;
			border: none;
			margin: 8px 0 6px 0;
		}

		.items {
			padding: 0;
		}
	}
</style>
