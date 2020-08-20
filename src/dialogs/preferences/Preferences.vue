<template>
	<div class="maincontainer">
		<Virplugs-Page-Chooser class="chooser" main-header="Preferences">
			<div class="page general" title="General">
				hey
			</div>
			<div title="Plugin Parameters" class="page">
				hoi
			</div>
			<div title="Build Settings" class="page">
				hallo
			</div>
			<div title="Packaging" class="page">
				hallo
			</div>
		</Virplugs-Page-Chooser>

		<div class="buttons">
			<button class="button" type="button" @click="close">
				Cancel
			</button>
			<button
				class="button"
				type="submit"
				id="okbutton"
			>
				OK
			</button>
		</div>
	</div>
</template>

<script>

const remote = nodeRequire('electron').remote;
const process = remote.require('process');

import VirplugsPageChooser from '@/components/PageChooser.vue';

export default {
	name: "Preferences",
	components: {
		VirplugsPageChooser
	},
	props: {
	},
	data: function () {
		return {
			platform: process.platform,
			filetypes: require('@/dialogs/newfile/filetypes.json'),
			currentFiletype: null,
			filename: ""
		};
	},
	watch: {
	},
	mounted: function () {

	},
	updated() {
	},
	created() {
	},
	destroyed() {
	},
	methods: {
		close() {
			this.$parent.closePortal();
		},

		ok() {
		}
	}
};
</script>

<style lang="less" scoped>
@import "@/styles/nativewidgets.less";

.maincontainer {
	background: #505050;
	font-family: Ubuntu, sans-serif;
	font-size: 14px;
	color: #ccc;
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	-webkit-subpixel-antialiasing: none;
	overflow: hidden;
}

.chooser {
	margin: 10px;
	margin-bottom: 0;
}

div {
	user-select: none;
}

.buttons {
	margin: 10px;
	text-align: right;

	button {
		margin-right: 10px;

		&:last-child {
			margin-right: 0;
		}
	}
}

</style>

