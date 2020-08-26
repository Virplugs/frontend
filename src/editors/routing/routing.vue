<template>
	<div class="container">
		<Virplugs-Toolbar>
			<Virplugs-toolbar-button
				title="Add"
				icon="plus"
				icon-color="#78B7B7"
				@click="openAddMenu"
			/>
			<Virplugs-toolbar-separator />
			<Virplugs-toolbar-button title="Duplicate" icon="copy" @click="duplicateSelectedNode" />
			<Virplugs-toolbar-button
				title="Delete"
				icon="x"
				icon-color="#B77878"
				@click="deleteSelectedNode"
			/>
			<Virplugs-toolbar-separator />
			<Virplugs-toolbar-button title="Arrange All Nodes" icon="coffee" />
			<Virplugs-toolbar-button
				title="Toggle Grid Snapping"
				icon="grid"
				icon-color="#B2AC73"
			/>
		</Virplugs-Toolbar>

		<div class="node-editor" ref="rete" />

		<div class="reload-message" v-show="needsReload">
			<i aria-hidden="true" data-feather="alert-triangle" color="#B2AC73" />
			<em>Warning</em>
			<br />
			The plugin context has changed. This editor-view needs to reload to reflect the current
			state.
			<br />
			<button id="reload-button" @click="reload">Reload</button>
		</div>
	</div>
</template>

<script>
const fs = require('fs');

import Rete from 'rete';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import HistoryPlugin from 'rete-history-plugin';
import KeyboardPlugin from 'rete-keyboard-plugin';
import ConnectionMasteryPlugin from 'rete-connection-mastery-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';

import VirplugsToolbar from '../../components/Toolbar/Toolbar.vue';
import VirplugsToolbarButton from '../../components//Toolbar/ToolbarButton.vue';
import VirplugsToolbarSeparator from '../../components//Toolbar/ToolbarSeparator.vue';

const remote = require('electron').remote;
const { Menu, MenuItem } = remote;

import * as components from './components';

import * as feather from 'feather-icons';

export default {
	name: 'VirplugsEditorRouting',
	props: {
		filename: {
			type: String,
			required: true,
			default: null,
		},
	},
	components: {
		VirplugsToolbar,
		VirplugsToolbarButton,
		VirplugsToolbarSeparator,
	},
	data: function () {
		return {
			needsReload: false,
		};
	},
	methods: {
		save() {
			fs.writeFile(
				this.filename,
				JSON.stringify(this.editor.toJSON()),
				{ encoding: 'utf8' },
				err => {
					if (err) {
						console.err(err);
					} else {
						console.log(this.filename + ' saved');
					}
				}
			);
		},

		focus() {
			//this..focus();
		},

		openAddMenu() {
			let event = {
				preventDefault: function () {},
				stopPropagation: function () {},
				clientX: 62,
				clientY: 57,
			};
			this.editor.trigger('contextmenu', { e: event, node: null });
		},

		duplicateSelectedNode() {
			this.editor.selected.each(node => {
				this.cloneNode(node);
			});
		},

		deleteSelectedNode() {
			this.editor.selected.each(node => {
				this.editor.removeNode(node);
			});
		},

		refresh() {
			console.log('Refresh Routing Editor');

			// check if parameters have been removed or added
			let projectParams = components
				.getParametersFromProjectFile()
				.map(p => p.title)
				.sort();
			let editorParams = [...this.editor.components]
				.filter(c => c[0].startsWith('Parameter: ') && !c[1].data?.props?.isPlaceholder)
				.map(c => c[0])
				.map(p => p.replace(/^Parameter: /, ''))
				.sort();
			let equal =
				projectParams.length === editorParams.length &&
				projectParams.every((value, index) => value === editorParams[index]);

			if (!equal) {
				console.warn(
					'Project Parameters changed, reload advised.',
					projectParams,
					editorParams
				);
				this.needsReload = true;
			}
		},

		async cloneNode(node) {
			const {
				name,
				position: [x, y],
				...params
			} = node;
			const component = this.editor.components.get(name);
			const clone = await createNode(component, { ...params, x: x + 10, y: y + 10 });

			this.editor.addNode(clone);
		},

		deselectAll() {
			let selected = [...this.editor.selected.list];
			this.editor.selected.clear();
			selected.forEach(n => n.update());
		},

		async readFile() {
			const data = JSON.parse(
				fs.readFileSync(this.filename, { encoding: 'utf8' }).toString()
			);
			components.createParameterPlaceholders(data, this.editor, this.engine);
			await this.editor.fromJSON(data);
			this.editor.trigger('process');
			this.editor.view.resize();
			AreaPlugin.zoomAt(this.editor);
			this.editor.view.area.zoom(1);
		},

		async unloadRete() {
			this.editor.destroy();
			this.$refs.rete.innerHTML = '';
		},

		async initRete() {
			this.editor = new Rete.NodeEditor('virplugs-route@1.0.0', this.$refs.rete);
			this.editor.use(ConnectionPlugin);
			this.editor.use(VueRenderPlugin);
			this.editor.use(ContextMenuPlugin, {
				delay: 9999999,
				allocate(component) {
					if (component instanceof components.ParameterRouteComponent) {
						if (component.data.props.isPlaceholder) {
							return null;
						} else {
							return ['Parameters'];
						}
					} else {
						return [];
					}
				},
			});
			this.editor.use(AreaPlugin, { snap: { size: 1 } });
			// editor.use(CommentPlugin.default);
			this.editor.use(HistoryPlugin);
			this.editor.use(ConnectionMasteryPlugin);
			this.editor.use(AutoArrangePlugin);
			this.editor.use(KeyboardPlugin);
			this.editor.use(MinimapPlugin, { size: 'small' });

			this.engine = new Rete.Engine('virplugs-route@1.0.0');

			this.editor.on(
				'process nodecreated noderemoved connectioncreated connectionremoved',
				async () => {
					//console.log('process');
					await this.engine.abort();
					await this.engine.process(this.editor.toJSON());
				}
			);

			const self = this;
			this.editor.on('showcontextmenu', ({ node }) => {
				if (!node) {
					return true; // let rete-context handle this, show the add menu
				} else {
					//console.log("Show native context");
					self.editor.selectNode(node);

					const menu = new Menu();
					menu.append(
						new MenuItem({
							label: 'Duplicate',
							click() {
								self.cloneNode(node);
							},
						})
					);
					menu.append(
						new MenuItem({
							label: 'Delete',
							click() {
								self.editor.removeNode(node);
							},
						})
					);
					//menu.append(new MenuItem({ type: 'separator' }));
					//menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox' }));
					menu.popup();

					return false;
				}
			});

			this.editor.on('keydown', e => {
				if (e.key === 'Shift') {
					AreaPlugin._snap.size = 16;
				}
			});

			this.editor.on('keyup', e => {
				//console.log(e);

				if (e.key === 'Shift') {
					AreaPlugin._snap.size = 1;
				}
			});

			components.loadComponents().map(c => {
				this.editor.register(c);
				this.engine.register(c);
			});

			this.readFile();

			this.refresh();
		},

		async reload() {
			this.needsReload = false;
			this.unloadRete();
			this.initRete();
		},
	},
	updated() {
		// console.log('updated '+ this.filename);
	},
	activated() {
		//console.log("activated");
		//this.monacoEditor.layout();
	},
	async mounted() {
		await this.initRete();

		this.$refs.rete.addEventListener('click', e => {
			if (e.target === this.$refs.rete) {
				this.deselectAll();
			}
		});

		new ResizeObserver(entries => {
			this.editor.view.resize();
		}).observe(this.$el);

		feather.replace();
	},
};

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

async function createNode(component, { data = {}, meta = {}, x = 0, y = 0 }) {
	const node = await component.createNode(deepCopy(data));

	node.meta = Object.assign(deepCopy(meta), node.meta);
	node.position[0] = x;
	node.position[1] = y;

	return node;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../styles/vars.less';

.container {
	flex: 1;
	min-height: 0;
	background: @colorPanelBackground;
	cursor: default;
	position: relative;
	overflow: hidden;
}

.editor {
	flex: 1;
	min-height: 0;
	background: @colorPanelBackground;
	cursor: default;
}

.toolbar {
	height: 32px;
	display: flex;
	padding: 2px;
	z-index: 10;
	flex-basis: 32px;
	position: absolute;
	margin: 4px;
	width: calc(100% - 8px);
	border-bottom: none;
	box-sizing: border-box;
	background: #2d2a2f;
	box-shadow: 0 0 7px 6px #181619;
	cursor: default;
	user-select: none;

	.separator {
		height: 22px;
		position: relative;
		top: 3px;
	}
}
</style>

<style lang="less">
@import './style.less';
</style>
