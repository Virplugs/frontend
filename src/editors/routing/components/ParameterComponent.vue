<template>
	<div
		class="node parameter"
		:class="[selected(), node.name, isPlaceholder ? 'placeholder' : ''] | kebab"
		:title="isPlaceholder ? 'This parameter is referenced, but does not currently exist' : ''"
	>
		<div class="nsockets">
			<!-- Outputs-->
			<div
				class="outputs"
				v-if="outputs().length"
				:class="inputs().length ? 'has-inputs' : 'no-inputs'"
			>
				<div class="output" v-for="output in outputs()" :key="output.key">
					<div class="output-title">
						{{ output.name }}
					</div>
					<ParameterSocket
						v-socket:output="output"
						type="output"
						:socket="output.socket"
						:used="() => output.connections.length"
					/>
				</div>
			</div>
		</div>
		<!-- Controls-->
		<div class="controls" v-if="controls().length">
			<div
				class="control"
				v-for="control in controls()"
				v-control="control"
				:key="control.key"
			/>
		</div>
	</div>
</template>

<script>
import VueRenderPlugin from 'rete-vue-render-plugin';
import ParameterSocket from './ParameterSocket.vue';

export default {
	name: 'ParameterComponent',
	mixins: [VueRenderPlugin.mixin],
	components: {
		ParameterSocket,
	},
	props: {
		isPlaceholder: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
