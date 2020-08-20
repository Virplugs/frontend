<template>
	<div class="parameters">
		<Virplugs-Toolbar class="toolbar">
			<Virplugs-toolbar-button
				title="Add Parameter"
				icon="plus"
				icon-color="#78B7B7"
				@click="createParameter(true)"
			/>
			<Virplugs-toolbar-button
				title="Collapse All"
				icon="minus-square"
				@click="collapseAll"
			/>
		</Virplugs-Toolbar>

		<ul class="parameter-list">
			<VirplugsEditorProjectParameter
				v-for="parameter in parameters"
				:parameter="parameter"
				:key="parameter.id"
				ref="parameters"
				@delete="deleteParameter(parameter)"
				@duplicate="duplicateParameter(parameter)"
			/>
		</ul>
	</div>
</template>

<script>
import $ from 'jquery';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/sortable';

import VirplugsEditorProjectParameter from './parameter.vue';

import VirplugsToolbar from "../../components/Toolbar/Toolbar.vue";
import VirplugsToolbarButton from "../../components//Toolbar/ToolbarButton.vue";
// import VirplugsToolbarSeparator from "../../components//Toolbar/ToolbarSeparator.vue";

function nextID(parameters) {
	for (let i = 0; i < 2147483648; i++) {
		if (!parameters.some(p => p.id === i)) {
			return i;
		}
	}
	alert("Ran out of ID space");
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
	name: 'VirplugsEditorProjectParameters',
	components: {
		VirplugsEditorProjectParameter,
		VirplugsToolbar,
		VirplugsToolbarButton
	},
	props: {
		parameters: {
			type: Array,
			default: () => [],
			required: true
		}
	},
	methods: {
		async createParameter(anim) {
			if (anim && this.collapseAll()) await sleep(200);

			this.parameters.push({
				"id": nextID(this.parameters),
				"title": "",
				"shortTitle": "",
				"units": "",
				"stepCount": "",
				"defaultNormalizedValue": "",
				"flagIsReadOnly": false,
				"flagIsWrapAround": false,
				"flagIsList": false,
				"flagIsProgramChange": false,
				"flagIsBypass": false
			});

			if (anim && this.$refs.parameters?.length) {
				this.$refs.parameters[this.$refs.parameters.length - 1].$el.scrollIntoView({
					behavior: 'smooth'
				});
			}
			return this.parameters[this.parameters.length - 1];

		},
		collapseAll() {
			if (!this.$refs.parameters) return;
			if (!this.$refs.parameters.length) {
				this.$refs.parameters.isCollapsed = true;
				return;
			}
			for (let parameter of this.$refs.parameters) {
				parameter.isCollapsed = true;
			}
		},
		deleteParameter(parameter) {
			this.parameters.splice(this.parameters.indexOf(parameter), 1);
		},
		duplicateParameter(parameter) {
			const copy = JSON.parse(JSON.stringify(parameter));
			copy.id = nextID(this.parameters);
			copy.title += " (duplicate)";
			this.parameters.splice(this.parameters.indexOf(parameter) + 1, 0,
				copy);
		}
	},
	mounted() {
		const list = $(this.$el).find(".parameter-list");
		list.sortable({
			axis: 'y',
			handle: ".title",
			placeholder: null,
			stop: (event, ui) => {
				const parameter = ui.item[0].__vue__.parameter;
				const newIndex = ui.item.index();
				const oldIndex = this.parameters.indexOf(parameter);

				list.sortable('cancel');

				//console.log(`parameter ${parameter.title} from ${oldIndex} to ${newIndex}`);

				this.parameters.splice(newIndex, 0, this.parameters.splice(oldIndex, 1)[0]);
				// // first remove this emelent from the array:
				// this.parameters.splice(this.parameters.indexOf(parameter), 1);
				// // then re-insert it at the new index:
				// this.parameters.splice(newIndex, 0, parameter);

				return false;
			}
		});
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../styles/vars.less";

.parameters {
	display: flex;
	height: 100%;
	flex-direction: column;
}

.parameter-list {
	list-style-type: none;
	margin: 0;
	padding: 0;
	flex: 1 1;
	overflow-y: hidden;
	margin-right: 10px;

	&:hover {
		overflow-y: scroll;
		margin-right: 0;
	}
}

.toolbar {
	margin: 4px;
	background: @colorPanelToolbarBackground;
	padding: 2px;
}

</style>
