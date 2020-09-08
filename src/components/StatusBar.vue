<template>
	<div class="statusbar">blablabla</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop } from 'vue-property-decorator';
import 'vue-class-component/hooks';
@Component({
	components: {},
})
export default class StatusBar extends Vue {}
</script>

<style scoped lang="less">
.statusbar {
	background: #202020;
	font-size: 14px;
	font-weight: 500;
	flex-basis: 40px;
	line-height: 40px;
	padding: 0 16px;
}
</style>
