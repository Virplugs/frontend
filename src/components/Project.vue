<template>
	<div class="project">
		<rs-panes
			split-to="rows"
			:allow-resize="true"
			primary="second"
			:size="250"
			resizer-color="#202020"
			:resizer-thickness="1"
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
					<Mixer ref="mixer" :master-track="project.masterTrack" />
				</div>
			</rs-panes>
			<div slot="secondPane">BOTTOM</div>
		</rs-panes>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import ResSplitPane from 'vue-resize-split-pane';
import VirplugsBrowser from '@/components/browser/Browser.vue';
import Mixer from '@/components/mixer/Mixer.vue';

import _Project from '@/project';
import Track from '@/track';

@Component({
	components: {
		'rs-panes': ResSplitPane,
		VirplugsBrowser,
		Mixer,
	},
})
export default class Project extends Vue {
	project: _Project = new _Project();
	FLAG__isRootProject = true;

	created() {
		this.project.masterTrack.addSubTrack(new Track('EL GUITAR'));
		this.project.masterTrack.addSubTrack(new Track('DRUMS'));
		this.project.masterTrack.addSubTrack(new Track('ROLAND 808'));
	}

	groupSelected() {
		(this.$refs.mixer as any).groupSelected();
	}
	deleteSelected() {
		(this.$refs.mixer as any).deleteSelected();
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
}
</style>
