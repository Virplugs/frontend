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

const path = __non_webpack_require__('path');
const remote = __non_webpack_require__('electron').remote;
const { dialog } = remote;

import * as ae from '@/audioengine.js';

const process = remote.require('process');

import VirplugsTabs from "@/components/Tabs.vue";
import VirplugsProject from "@/Project.vue";

import VirplugsHeader from "@/components/header/Header.vue";
import VirplugsHeaderSection from "@/components/header/HeaderSection.vue";
import VirplugsHeaderSectionItem from "@/components/header/HeaderSectionItem.vue";

import VirplugsDialogWindow from "@/components/DialogWindow.vue";
import Preferences from "@/dialogs/preferences/Preferences.vue";

import * as preferences from '@/preferences.js';

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
		var tabs = [
			{
				component: VirplugsProject,
				props: {
					title: "Project 1",
					key: "Project 1",
					msg: "project 1"
				}
			}
		];
		return {
			platform: process.platform,
			currentTab: tabs[0],
			tabs,
			preferencesDialogOpen: false,
		};
	},
	mounted: async function () {
		if (ae.init()) {
			let deviceNameIn, deviceNameOut;
			switch (preferences.get('audio_api')) {
				case 'asio':
					deviceNameIn = preferences.get('audio_asio_device');
					deviceNameOut = preferences.get('audio_asio_device');
					break;
				case 'wasapi':
					deviceNameIn = preferences.get('audio_wasapi_inputdevice');
					deviceNameOut = preferences.get('audio_wasapi_outputdevice');
					break;
				case 'ds':
					deviceNameIn = preferences.get('audio_ds_inputdevice');
					deviceNameOut = preferences.get('audio_ds_outputdevice');
					break;
				case 'core':
					deviceNameIn = preferences.get('audio_core_inputdevice');
					deviceNameOut = preferences.get('audio_core_outputdevice');
					break;
				default:
					return;
			}

			let api = preferences.get('audio_api');
			let sampleRate = preferences.get('audio_samplerate');
			let bufferSize = preferences.get('audio_buffersize');

			ae.start(api, deviceNameIn, deviceNameOut, sampleRate, bufferSize);
			console.log(api, deviceNameIn, deviceNameOut, sampleRate, bufferSize);
		}

		this.$nextTick(function () {
			setTimeout(() => {
				console.log("Virplugs ready");
				window.win.show();
				const ipc = __non_webpack_require__('electron').ipcRenderer;
				ipc.send('ready');
				window.win.focus();
			}, 500);
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
