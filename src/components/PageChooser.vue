<template>
	<div class="page-chooser">
		<div class="tabs">
			<div class="head-title" v-if="showHeaders">
				{{ mainHeader }}
			</div>
			<ul>
				<li
					v-for="slot in $slots.default"
					:key="slot.key"
					:class="{selected: slot && currentSlot && slot.data.attrs.title === currentSlot.data.attrs.title}"
					@click="currentSlot = slot"
				>
					{{ slot ? slot.data.attrs.title : '' }}
				</li>
			</ul>
		</div>
		<div class="content">
			<div class="head-title" v-if="showHeaders">
				{{ currentSlot ? currentSlot.data.attrs.title : '' }}
			</div>

			<div class="page">
				<VNode :node="currentSlot" />
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';

const VNode = Vue.component("vnode", {
	functional: true,
	render(h, context){
		return context.props.node;
	}
});

export default {
	name: 'VirplugsPageChooser',
	components: {
		VNode
	},
	props: {
		tabs: {
			type: Array,
			default: () => []
		},
		currentTab: {
			type: Object,
			default: () => null
		},
		showHeaders: {
			type: Boolean,
			default: true,
			required: false
		},
		mainHeader: {
			type: String,
			default: 'Configuration',
			required: false
		}
	},
	data: function() {
		return {
			currentSlot: null,
			hasFocus: false,
		};
	},
	computed: {
	},
	methods: {
		title(slot) {
			console.dir(slot);
		},
		selectTab(tab) {
			this.prevTab = this.currentTab;
			this.myCurrentTab = tab;
			this.$emit('update:currentTab', tab);

			// this.$nextTick(() => {
			// 	console.log("switching to ", this.$refs.editor[0]._props.filename);
			// });
		},

		closeTab(tab) {
			const index = this.tabs.indexOf(tab);
			//this.tabs = this.tabs.filter(t => t !== tab);
			this.$emit('update:tabs', this.tabs.filter(t => t !== tab));

			// If we weren't collapsed, select another tab
			this.currentTab && this.$nextTick(() => {
				if (this.tabs.includes(this.prevTab)) {
					this.selectTab(this.prevTab);
				} else {
					this.selectTab(this.tabs[Math.min(index, this.tabs.length - 1)]);
				}
			});
		},

		getCurrentTab() {
			return this.$refs.editor[0];
		},

		focusIn(event) {
			this.hasFocus = true;
		},

		focusOut(event) {
			this.hasFocus = false;
		},
	},
	mounted: function() {
		this.$nextTick(()=>{
			this.currentSlot = this.$slots.default[0];
		});
		// console.dir(this.currentSlot);

		this.$el.addEventListener('focusin', this.focusIn);
		this.$el.addEventListener('focusout', this.focusOut);
	},
	beforeDestroy() {
		this.$el.removeEventListener('focusin', this.focusIn);
		this.$el.removeEventListener('focusout', this.focusOut);
	},

};
</script>

<style scoped lang="less">
@import "../styles/vars.less";

.page-chooser {
	background: transparent;
	display: flex;
	flex-direction: row;
	position: relative;
	flex: 1;
}

.tabs {
	flex: 0 0 200px;
	margin-right: 4px;
	background: #353535;
	margin-top: 32px;
	padding: 2px;
	display: flex;

	ul {
		display: block;
		flex: 2 0;
		padding: 0;
		overflow-x: hidden;
		margin: 0;
		font-size: 14px;
		overflow-y: scroll;

		li {
			display: block;
			padding: 4px 8px;

			&:hover {
				background: rgba(255, 255, 255, 0.03);
			}

			&.selected {
				background: #202020;
			}
		}
	}
}

.head-title {
	height: 32px;
	line-height: 32px;
	font-size: 14px;
	padding: 0 8px;
	color: white;
	box-sizing: border-box;
	font-weight: 300;
	position: absolute;
	top: 0;
}

.content {
	flex: 2;
	background: #353535;
	margin-top: 32px;
	display: flex;

	.page {
		flex: 1;
		overflow: hidden;
		display: flex;
	}
}

</style>
