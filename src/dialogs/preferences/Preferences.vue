<template>
	<div class="maincontainer">
		<Virplugs-Page-Chooser class="chooser" main-header="Preferences">
			<div class="page general" title="General">hey</div>
			<div title="Audio" class="page">
				<fieldset>
					<legend>Audio Device</legend>

					<label>
						Driver Type
						<div>
							<select v-model="preferences.audio_api" @change="resetAudioEngine">
								<option
									v-for="(api, name) in audioDeviceInfo"
									:key="name"
									:value="name"
								>
									{{ api.displayName }}
								</option>
							</select>
						</div>
					</label>
					<template v-if="preferences.audio_api == 'asio'">
						<label>
							Audio Device
							<div>
								<select
									v-model="preferences.audio_asio_device"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.asio.devices"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
						<label>
							<div>
								<button @click="asioControlPanel">Hardware Setup</button>
							</div>
						</label>
					</template>
					<template v-if="preferences.audio_api == 'wasapi'">
						<label>
							Audio Input Device
							<div>
								<select
									v-model="preferences.audio_wasapi_inputdevice"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.wasapi.devices.filter(
											d => d.inputChannels > 0
										)"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
						<label>
							Audio Output Device
							<div>
								<select
									v-model="preferences.audio_wasapi_outputdevice"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.wasapi.devices.filter(
											d => d.outputChannels > 0
										)"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
					</template>
					<template v-if="preferences.audio_api == 'ds'">
						<label>
							Audio Input Device
							<div>
								<select
									v-model="preferences.audio_ds_inputdevice"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.ds.devices.filter(
											d => d.inputChannels > 0
										)"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
						<label>
							Audio Output Device
							<div>
								<select
									v-model="preferences.audio_ds_outputdevice"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.ds.devices.filter(
											d => d.outputChannels > 0
										)"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
					</template>
					<template v-if="preferences.audio_api == 'core'">
						<label>
							Audio Input Device
							<div>
								<select
									v-model="preferences.audio_core_inputdevice"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.core.devices.filter(
											d => d.inputChannels > 0
										)"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
						<label>
							Audio Output Device
							<div>
								<select
									v-model="preferences.audio_core_outputdevice"
									@change="resetAudioEngine"
								>
									<option
										v-for="dev in audioDeviceInfo.core.devices.filter(
											d => d.outputChannels > 0
										)"
										:key="dev.name"
										:value="dev.name"
									>
										{{ dev.name }}
									</option>
								</select>
							</div>
						</label>
					</template>
				</fieldset>

				<fieldset v-if="currentOutputDevice">
					<legend>Sample Rate</legend>

					<label>
						In/Out Sample Rate
						<div>
							<select
								v-model="preferences.audio_samplerate"
								@change="resetAudioEngine"
							>
								<option
									v-for="sr in currentOutputDevice.sampleRates"
									:key="sr"
									:value="sr"
								>
									{{ sr }}
								</option>
							</select>
						</div>
					</label>
					<label>
						Buffer Size
						<div>
							<input
								type="range"
								value="256"
								min="64"
								max="2048"
								step="64"
								v-model="buffersize"
							/>
							<span class="rangetext">{{ buffersize }} Samples</span>
						</div>
					</label>
				</fieldset>

				<fieldset v-if="currentOutputDevice">
					<legend>Latency</legend>

					<label>
						Input Latency
						<div v-if="latencyInput > 0">{{ latencyInput | digits }} ms</div>
						<div v-else>unknown</div>
					</label>
					<label>
						Output Latency
						<div v-if="latencyOutput > 0">{{ latencyOutput | digits }} ms</div>
						<div v-else>unknown</div>
					</label>
					<label>
						Overall Latency
						<div v-if="latencyTotal > 0">{{ latencyTotal | digits }} ms</div>
						<div v-else>unknown</div>
					</label>
				</fieldset>
			</div>
			<div title="MIDI" class="page">hallo</div>
			<div title="Plug-Ins" class="page">hallo</div>
		</Virplugs-Page-Chooser>

		<!-- <div class="buttons">
			<button class="button" type="button" @click="close">
				Cancel
			</button>
			<button
				class="button"
				type="submit"
				@click="ok"
			>
				OK
			</button>
		</div> -->
	</div>
</template>

<script>
const remote = require('electron').remote;
const process = remote.require('process');

import debounce from 'lodash.debounce';

import * as ae from '@/audioengine.js';
import * as preferences from '@/preferences.js';

import VirplugsPageChooser from '@/components/PageChooser.vue';

export default {
	name: 'Preferences',
	components: {
		VirplugsPageChooser,
	},
	filters: {
		digits: function (value, digits = 2) {
			if (!value) {
				return value;
			}
			if (typeof value === 'string') {
				value = parseFloat(value);
			}
			return value.toFixed(digits);
		},
	},
	props: {},
	data: function () {
		const prefs = preferences.getCopy();
		return {
			platform: process.platform,
			preferences: prefs,
			audioDeviceInfo: ae.getDeviceInfo(),
			latencyInput: 0,
			latencyOutput: 0,
			latencyTotal: 0,
			buffersize: prefs.audio_buffersize,
		};
	},
	computed: {
		currentInputDevice() {
			if (this.preferences.audio_api === 'asio') {
				return this.audioDeviceInfo.asio.devices.find(
					d => d.name === this.preferences.audio_asio_device
				);
			} else if (this.preferences.audio_api === 'wasapi') {
				return this.audioDeviceInfo.wasapi.devices.find(
					d => d.name === this.preferences.audio_wasapi_inputdevice
				);
			} else if (this.preferences.audio_api === 'ds') {
				return this.audioDeviceInfo.ds.devices.find(
					d => d.name === this.preferences.audio_wasapi_inputdevice
				);
			} else if (this.preferences.audio_api === 'core') {
				return this.audioDeviceInfo.core.devices.find(
					d => d.name === this.preferences.audio_core_inputdevice
				);
			} else {
				return null;
			}
		},
		currentOutputDevice() {
			if (this.preferences.audio_api === 'asio') {
				return this.audioDeviceInfo.asio.devices.find(
					d => d.name === this.preferences.audio_asio_device
				);
			} else if (this.preferences.audio_api === 'wasapi') {
				return this.audioDeviceInfo.wasapi.devices.find(
					d => d.name === this.preferences.audio_wasapi_outputdevice
				);
			} else if (this.preferences.audio_api === 'ds') {
				return this.audioDeviceInfo.ds.devices.find(
					d => d.name === this.preferences.audio_ds_outputdevice
				);
			} else if (this.preferences.audio_api === 'core') {
				return this.audioDeviceInfo.core.devices.find(
					d => d.name === this.preferences.audio_core_outputdevice
				);
			} else {
				return null;
			}
		},
	},
	watch: {
		preferences: {
			handler(val) {
				this.save();
			},
			deep: true,
		},
		buffersize: debounce(function (val) {
			this.$set(this.preferences, 'audio_buffersize', parseInt(val));
			this.resetAudioEngine();
		}, 1000),
	},
	methods: {
		resetAudioEngine() {
			ae.stop();
			ae.start(
				this.preferences.audio_api,
				this.currentInputDevice.name,
				this.currentOutputDevice.name,
				this.preferences.audio_samplerate,
				this.preferences.audio_buffersize
			);
			setTimeout(() => {
				ae.requestLatencyInfo();
			}, 2000);
		},

		asioControlPanel() {
			ae.openAsioControlPanel();
		},

		close() {
			this.$parent.closePortal();
		},

		save() {
			console.log('save');
			console.log(this.preferences);
			preferences.setFromObject(this.preferences);
			preferences.commit();
			console.log('done save');
		},
	},
	mounted() {
		this.$root.$on('latencyUpdated', data => {
			this.latencyInput = data.input;
			this.latencyOutput = data.output;
			this.latencyTotal = data.total;
		});
		ae.requestLatencyInfo();
	},
};
</script>

<style lang="less" scoped>
@import '@/styles/nativewidgets.less';

.maincontainer {
	background: #505050;
	font-family: Ubuntu, sans-serif;
	font-size: 14px;
	color: #b5b2b1;
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	-webkit-subpixel-antialiasing: none;
	overflow: hidden;
}

.chooser {
	margin: 10px;
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

fieldset {
	border: none;
	border-top: 1px solid #8f8d8c;
	margin-bottom: 20px;

	legend {
		padding: 0 10px;
		font-size: 12px;
		text-transform: uppercase;
	}

	label {
		display: block;
		font-size: 13px;
		clear: both;
		line-height: 28px;

		> div {
			float: right;
			width: 50%;
			display: table-cell;
			vertical-align: middle;
			position: relative;

			select,
			input {
				width: 100%;
			}

			&::before {
				content: '\00A0';
				width: 0;
				display: inline-block;
			}

			input[type='range'] {
				position: relative;
				top: 3px;
			}

			.rangetext {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				text-align: center;
				pointer-events: none;
				font-size: 12px;
			}
		}
	}
}

.page {
	padding: 10px;
	width: 100%;
}
</style>
