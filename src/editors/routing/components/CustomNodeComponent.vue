<template>
	<div class="node" :class="[selected(), node.name] | kebab">
		<div class="title">
			{{ node.name }}
		</div>
		<div class="nsockets">
			<!-- Inputs-->
			<div
				class="inputs"
				v-if="inputs().length"
				:class="outputs().length ? 'has-outputs' : 'no-outputs'"
			>
				<div class="input" v-for="input in inputs()" :key="input.key">
					<div
						class="input-control-container"
						:class="[input.socket.name] | kebab"
						v-show="input.showControl()"
					>
						<div class="input-control" v-control="input.control" />
					</div>
					<CustomSocket
						v-socket:input="input"
						type="input"
						:socket="input.socket"
						:used="() => input.connections.length"
					/>
					<div class="input-title">
						{{ input.name }}
					</div>
				</div>
			</div>
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
					<CustomSocket
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
import CustomSocket from './CustomSocket.vue';

export default {
	name: 'CustomNodeComponent',
	mixins: [VueRenderPlugin.mixin],
	components: {
		CustomSocket,
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bla {
	display: inherit;
}
</style>
