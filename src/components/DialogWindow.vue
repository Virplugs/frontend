<template>
	<div v-if="open">
		<slot @closeWindow="closePortal" />
	</div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator';
import 'vue-class-component/hooks';

import { palette } from '@/styles';

function copyStyles(sourceDoc: Document, targetDoc: Document) {
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

@Component
export default class DialogWindow extends Vue {
	@Model('close', { default: false }) readonly open!: boolean;
	@Prop({ default: 600 }) width!: number;
	@Prop({ default: 400 }) height!: number;
	@Prop({ default: 'modal' }) type!: string;
	@Prop({ default: false }) resizable!: boolean;
	@Prop({ default: '' }) title!: string;

	windowRef: Window | null = null;

	@Watch('open') onOpenChanged(newOpen: boolean) {
		if (newOpen) {
			this.openPortal();
		} else {
			this.closePortal();
		}
	}

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

		if (this.windowRef === null) {
			return;
		}

		this.windowRef.document.body.style.backgroundColor = palette.colorPanelBackground;
		this.windowRef.document.body.appendChild(this.$el);
		copyStyles(window.document, this.windowRef.document);
		this.windowRef.addEventListener('beforeunload', () => {
			this.$emit('update:open', false);
		});
	}
	closePortal() {
		if (this.windowRef) {
			this.windowRef.close();
			this.windowRef = null;
			this.$emit('close');
		}
	}
	mounted() {
		if (this.open) {
			this.openPortal();
		}
	}
	beforeDestroy() {
		if (this.windowRef) {
			this.closePortal();
		}
	}
}
</script>
