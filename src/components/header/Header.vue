<template>
	<header>
		<slot />
	</header>
</template>

<script>
export default {
	name: 'VirplugsHeader',
	props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
header {
	background: #202020;
	height: 96px;
}
</style>
