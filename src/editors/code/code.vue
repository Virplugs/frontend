<template>
	<div class="editor" ref="container" />
</template>

<script>
const fs = __non_webpack_require__('fs');
import * as monaco from 'monaco-editor';
import { palette } from '@/styles.js';

export default {
	name: 'VirplugsEditorCode',
	props: {
		filename: {
			type: String,
			required: true,
			default: null
		}
	},
	methods: {
		onResize(e) {
			this.monacoEditor.layout();
		},
		save() {
			fs.writeFile(this.filename, this.monacoEditor.getValue(),
				{ encoding: "utf8" },
				(err) => {
					if (err) {
						console.err(err);
					} else {
						console.log(this.filename + " saved");
					}
				});
		},
		focus() {
			this.monacoEditor.focus();
		}
	},
	created() {
		window.addEventListener("resize", this.onResize);
	},
	destroyed() {
		window.removeEventListener("resize", this.onResize);
	},
	updated() {
		// console.log('updated '+ this.filename);
	},
	activated() {
		//console.log("activated");
		this.monacoEditor.layout();
	},
	mounted() {
		monaco.editor.defineTheme('myCoolTheme', {
			base: 'vs-dark',
			inherit: true,
			"colors": {
				"editor.background": palette.colorPanelBackground,
				"editor.lineHighlightBorder": "#FFFFFF10",
				"editor.lineHighlightBackground": "#FFFFFF10"
			},
			rules: [
				{ background: palette.colorPanelBackground }
				// { token: 'custom-info', foreground: '808080' },
				// { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
				// { token: 'custom-notice', foreground: 'FFA500' },
				// { token: 'custom-date', foreground: '008800' },
			]
		});

		this.monacoEditor = monaco.editor.create(this.$refs.container, {
			theme: 'myCoolTheme',
			language: 'cpp'
		});

		let data = fs.readFileSync(this.filename, {encoding: "utf8"});
		this.monacoEditor.setValue(data.toString());

		new ResizeObserver(entries => {
			this.monacoEditor.layout();
		}).observe(this.$el);


		// editor.addAction({
		// 	id: 'my-save-id',
		// 	label: 'Save file',

		// 	keybindings: [
		// 		monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
		// 	],
		// 	precondition: null,
		// 	keybindingContext: null,
		// 	contextMenuGroupId: 'navigation',
		// 	contextMenuOrder: 1.5,
		// 	// Method that will be executed when the action is triggered.
		// 	// @param editor The editor instance is passed in as a convinience
		// 	run: function (ed) {
		// 		parent.saveCurrentEditor();
		// 		return null;
		// 	}
		// });
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../styles/vars.less";

.editor {
	flex: 1;
	min-height: 0;
	background: @colorPanelBackground;
	cursor: default;
}

</style>
