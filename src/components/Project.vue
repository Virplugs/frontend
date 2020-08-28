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
			<div slot="secondPane">
				BOTTOM
			</div>
		</rs-panes>
	</div>
</template>

<script>
import ResSplitPane from 'vue-resize-split-pane';
import VirplugsBrowser from '@/components/browser/Browser.vue';
import Mixer from '@/components/mixer/Mixer.vue';

import Project from '@/project';
import Track from '@/track';

export default {
	components: {
		'rs-panes': ResSplitPane,
		VirplugsBrowser,
		Mixer,
	},
	data: function () {
		const project = new Project();
		project.masterTrack.addSubTrack(new Track('EL GUITAR'));
		project.masterTrack.addSubTrack(new Track('DRUMS'));
		project.masterTrack.addSubTrack(new Track('ROLAND 808'));
		return {
			project,
			FLAG__isRootProject: true,
		};
	},
	methods: {
		groupSelected() {
			this.$refs.mixer.groupSelected();
		},
		deleteSelected() {
			this.$refs.mixer.deleteSelected();
		},
	}
};
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
