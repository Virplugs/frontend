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
				<div slot="secondPane">CENTER</div>
			</rs-panes>
			<div slot="secondPane">BOTTOM</div>
		</rs-panes>
	</div>
</template>

<script>
import ResSplitPane from 'vue-resize-split-pane';
import VirplugsBrowser from '@/components/browser/Browser.vue';

import audioEngine from '@/audioengine';

export default {
	components: {
		'rs-panes': ResSplitPane,
		VirplugsBrowser,
	},
	data: function () {
		const transport = new audioEngine.Transport();
		const cueTrack = new audioEngine.Track('cue', [0], [0]);
		transport.tracks = [cueTrack];
		audioEngine.setActiveTransport(transport);
		return {
			FLAG__isRootProject: true,
			transport,
			cueTrack,
		};
	},
};

export function getProject(vueElement) {
	while (!!vueElement && !vueElement.FLAG__isRootProject) {
		vueElement = vueElement.$parent;
	}
	return vueElement;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.project {
	display: block;
	flex: 1;
	overflow: hidden;
	position: relative;
}
</style>
