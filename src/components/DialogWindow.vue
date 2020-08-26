<template>
	<div v-if="open">
		<slot @closeWindow="closePortal" />
	</div>
</template>

<script>
import { palette } from '@/styles.js';

function copyStyles(sourceDoc, targetDoc) {
	Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
		if (styleSheet.cssRules) {
			// for <style> elements
			const newStyleEl = sourceDoc.createElement('style');

			Array.from(styleSheet.cssRules).forEach(cssRule => {
				// write the text of each rule into the body of the style element
				newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
			});

			targetDoc.head.appendChild(newStyleEl);
		} else if (styleSheet.href) {
			// for <link> elements loading CSS from a URL
			const newLinkEl = sourceDoc.createElement('link');

			newLinkEl.rel = 'stylesheet';
			newLinkEl.href = styleSheet.href;
			targetDoc.head.appendChild(newLinkEl);
		}
	});
}

export default {
	name: 'VirplugsDialogWindow',
	model: {
		prop: 'open',
		event: 'close',
	},
	props: {
		open: {
			type: Boolean,
			default: false,
		},
		width: {
			type: Number,
			default: 600,
		},
		height: {
			type: Number,
			default: 400,
		},
		type: {
			type: String,
			default: 'modal',
		},
		resizable: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			windowRef: null,
		};
	},
	watch: {
		open(newOpen) {
			console.log('newOpen', newOpen);
			if (newOpen) {
				this.openPortal();
			} else {
				this.closePortal();
			}
		},
	},
	methods: {
		openPortal() {
			const left = screen.width / 2 - this.width / 2;
			const top = screen.height / 2 - this.height / 2;

			this.windowRef = window.open(
				``,
				JSON.stringify({
					type: this.type,
					title: this.title,
				}),
				`width=${this.width},height=${this.height},left=${left},\
				top=${top},resizable=${this.resizable},title=bla`
			);
			this.windowRef.document.body.style.backgroundColor = palette.colorPanelBackground;
			this.windowRef.document.body.appendChild(this.$el);
			copyStyles(window.document, this.windowRef.document);
			this.windowRef.addEventListener('beforeunload', () => {
				this.$emit('update:open', false);
			});
		},
		closePortal() {
			if (this.windowRef) {
				this.windowRef.close();
				this.windowRef = null;
				this.$emit('close');
			}
		},
	},
	mounted() {
		if (this.open) {
			this.openPortal();
		}
	},
	beforeDestroy() {
		if (this.windowRef) {
			this.closePortal();
		}
	},
};
</script>
