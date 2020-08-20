<template>
	<div
		class="socket"
		:class="[type, socket.name, used()?'used':''] | kebab"
		:title="socket.name+'\\n'+socket.hint"
	/>
</template>

<script>
export default {
	name: 'CustomSocket',
	props: {
		type: {
			type: String,
			default: ''
		},
		socket: {
			type: Object,
			default: () => { return {name: ''}; }
		},
		used: {
			type: Function,
			default: () => 0
		}
	},
};
</script>
