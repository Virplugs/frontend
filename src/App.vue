<template>
	<div id="app" :class="[ 'platform-' + platform ]">
		<virplugs-header>
			<virplugs-header-section title="Tempo">
				<virplugs-header-section-item>
					LINK
				</virplugs-header-section-item>
				<virplugs-header-section-item>
					TAP
				</virplugs-header-section-item>
			</virplugs-header-section>

			<virplugs-header-section title="Transport">
				<virplugs-header-section-item>
					LINK
				</virplugs-header-section-item>
				<virplugs-header-section-item>
					TAP
				</virplugs-header-section-item>
			</virplugs-header-section>
		</virplugs-header>

		<virplugs-tabs
			:tabs.sync="tabs"
			:current-tab.sync="currentTab"
			ref="tabs"
		/>

		<virplugs-dialog-window
			:open.sync="preferencesDialogOpen"
			type="dialog"
			:resizable="true"
			title="Preferences"
			:height="500"
		>
			<Preferences />
		</virplugs-dialog-window>
	</div>
</template>

<script>

const path = nodeRequire('path');
const remote = nodeRequire('electron').remote;
const { dialog } = remote;

const process = remote.require('process');

import VirplugsTabs from "@/components/Tabs.vue";
import VirplugsProject from "@/Project.vue";

import VirplugsHeader from "@/components/header/Header.vue";
import VirplugsHeaderSection from "@/components/header/HeaderSection.vue";
import VirplugsHeaderSectionItem from "@/components/header/HeaderSectionItem.vue";

import VirplugsDialogWindow from "@/components/DialogWindow.vue";
import Preferences from "@/dialogs/preferences/Preferences.vue";
export default {
	name: "App",
	components: {
		VirplugsTabs,

		VirplugsHeader,
		VirplugsHeaderSection,
		VirplugsHeaderSectionItem,

		VirplugsDialogWindow,
		Preferences

	},
	data: function () {
		var tabs = [];
		return {
			platform: process.platform,
			currentTab: tabs[0],
			tabs,
			preferencesDialogOpen: false,
		};
	},
	mounted: function () {
		this.$nextTick(function () {
			setTimeout(() => {
				console.log("Virplugs ready");
				window.win.show();
				const ipc = nodeRequire('electron').ipcRenderer;
				ipc.send('ready');
				window.win.focus();
			}, 500);
		});

		this.tabs.push({
					component: VirplugsProject,
					props: {
						title: "Project 1",
						key: "Project 1",
						msg: "project 1"
					}
				});
				this.tabs.push({
					component: VirplugsProject,
					props: {
						title: "Project 2",
						key: "Project 2",
						msg: "project 2"
					}
				});
				this.tabs.push({
					component: VirplugsProject,
					props: {
						title: "Project 3",
						key: "Project 3",
						msg: "project 3"
					}
				});
	},
	updated() {
	},
	created() {
	},
	destroyed() {
	},
	methods: {
		openPreferences() {
			this.preferencesDialogOpen = true;
		}
	}
};
</script>

<style lang="less">
@import "~ubuntu-fontface/ubuntu.less";
@import "@/styles/nativewidgets.less";

#app {
	background: #202020;
	font-family: 'Ubuntu', sans-serif;
	font-size: 16px;
	color: #b5b2b1;
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	-webkit-subpixel-antialiasing: none;
	overflow: hidden;
	user-select: none;
}
</style>
