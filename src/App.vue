<template>
	<div id="app" :class="['platform-' + platform]">
		<virplugs-header />

		<virplugs-tabs :tabs.sync="tabs" :current-tab.sync="currentTab" ref="tabs" />

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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import * as ae from '@/audioengine';

import VirplugsTabs from '@/components/Tabs.vue';
import VirplugsProject from '@/components/Project.vue';

import VirplugsHeader from '@/components/header/Header.vue';

import VirplugsDialogWindow from '@/components/DialogWindow.vue';
import Preferences from '@/dialogs/preferences/Preferences.vue';

import * as preferences from '@/preferences';
import { getProject } from './project';

import electron = require('electron');
const process: NodeJS.Process = electron.remote.require('process');

//namespace Components {
@Component({
	components: {
		VirplugsTabs,
		VirplugsHeader,
		VirplugsDialogWindow,
		Preferences,
	},
})
export default class App extends Vue {
	tabs = [
		{
			component: VirplugsProject,
			props: {
				title: 'Project 1',
				key: 'Project 1',
				msg: 'project 1',
			},
		},
	];
	platform = process.platform;
	currentTab = this.tabs[0];
	preferencesDialogOpen = false;

	async mounted() {
		if (ae.init()) {
			let deviceNameIn: string, deviceNameOut: string;
			switch (preferences.get('audio_api')) {
				case 'asio':
					deviceNameIn = preferences.get('audio_asio_device') as string;
					deviceNameOut = preferences.get('audio_asio_device') as string;
					break;
				case 'wasapi':
					deviceNameIn = preferences.get('audio_wasapi_inputdevice') as string;
					deviceNameOut = preferences.get('audio_wasapi_outputdevice') as string;
					break;
				case 'ds':
					deviceNameIn = preferences.get('audio_ds_inputdevice') as string;
					deviceNameOut = preferences.get('audio_ds_outputdevice') as string;
					break;
				case 'core':
					deviceNameIn = preferences.get('audio_core_inputdevice') as string;
					deviceNameOut = preferences.get('audio_core_outputdevice') as string;
					break;
				default:
					return;
			}

			const api: string = preferences.get('audio_api') as string;
			const sampleRate: number = preferences.get('audio_samplerate') as number;
			const bufferSize: number = preferences.get('audio_buffersize') as number;

			ae.start(api, deviceNameIn, deviceNameOut, sampleRate, bufferSize);
			console.log(api, deviceNameIn, deviceNameOut, sampleRate, bufferSize);
		}

		this.$nextTick(function () {
			const project = getProject((this.$refs.tabs as any).getCurrentTab());
			project.setActive();
			setTimeout(() => {
				console.log('Virplugs ready');
				(window as any)['win'].show();
				const ipc = require('electron').ipcRenderer;
				ipc.send('ready');
				(window as any)['win'].focus();
			}, 500);
		});

		// this.tabs.push({
		// 	component: VirplugsProject,
		// 	props: {
		// 		title: 'Project 2',
		// 		key: 'Project 2',
		// 		msg: 'project 2',
		// 	},
		// });
		// this.tabs.push({
		// 	component: VirplugsProject,
		// 	props: {
		// 		title: 'Project 3',
		// 		key: 'Project 3',
		// 		msg: 'project 3',
		// 	},
		// });
	}

	openPreferences() {
		this.preferencesDialogOpen = true;
	}
}
//}
</script>

<style lang="less">
@import '~ubuntu-fontface/ubuntu.less';
@import '@/styles/nativewidgets.less';

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
