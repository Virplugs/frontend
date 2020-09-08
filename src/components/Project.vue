<template>
	<div class="project">
		<rs-panes
			split-to="rows"
			:allow-resize="true"
			primary="second"
			:size="250"
			resizer-color="#202020"
			:resizer-thickness="1"
			:min-size="40"
		>
			<rs-panes
				:allow-resize="true"
				split-to="columns"
				slot="firstPane"
				primary="first"
				:size="480"
				resizer-color="#202020"
				:resizer-thickness="1"
			>
				<virplugs-browser slot="firstPane" />
				<div class="main" slot="secondPane">
					<Mixer ref="mixer" :master-track="project.masterTrack" @select="select" />
				</div>
			</rs-panes>
			<div slot="secondPane" class="bottom">
				<clip-editor ref="clipEditor" v-if="isClip(selectedItem)" :clip="selectedItem" />
				<status-bar />
			</div>
		</rs-panes>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import ResSplitPane from 'vue-resize-split-pane';
import VirplugsBrowser from '@/components/browser/Browser.vue';
import Mixer from '@/components/mixer/Mixer.vue';
import StatusBar from '@/components/StatusBar.vue';
import ClipEditor from '@/components/inspector/ClipEditor.vue';

import _Project from '@/project';
import Track from '@/track';
import Clip, { AudioClip } from '@/clip';

@Component({
	components: {
		'rs-panes': ResSplitPane,
		VirplugsBrowser,
		Mixer,
		StatusBar,
		ClipEditor,
	},
})
export default class Project extends Vue {
	project: _Project = new _Project();
	FLAG__isRootProject = true;

	selectedType: object | null = null;
	selectedItem: object | null = null;

	public $refs!: {
		mixer: Mixer;
		clipEditor: ClipEditor;
	};

	created() {
		this.project.masterTrack.addSubTrack(new Track('EL GUITAR'));
		this.project.masterTrack.addSubTrack(new Track('DRUMS'));
		this.project.masterTrack.addSubTrack(new Track('ROLAND 808'));
	}

	groupSelected() {
		this.$refs.mixer.groupSelected();
	}

	deleteSelected() {
		this.$refs.mixer.deleteSelected();
	}

	select(type: object, item: object, allSelected: Array<object>) {
		this.selectedType = type;
		this.selectedItem = item;
	}

	isClip(clip: object) {
		return clip instanceof Clip;
	}

	isAudioClip(clip: Clip) {
		return clip instanceof AudioClip;
	}

	isTrack(track: object) {
		return track instanceof Track;
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.project {
	display: block;
	flex: 1;
	overflow: hidden;
	position: relative;

	.main {
		display: flex;
		height: 100%;
	}

	.bottom {
		display: flex;
		flex-direction: column;
		height: 100%;
		user-select: none;
	}
}
</style>
