<template>
	<div class="tabs" :class="{ isEmpty: tabs.length === 0 }" tabindex="0">
		<draggable
			class="tabbar"
			ref="tabbar"
			tag="ul"
			:list="tabs"
			v-bind="dragOptions"
			@start="drag = true"
			@end="drag = false"
		>
			<transition-group type="transition" :name="!drag ? 'flip-list' : null">
				<li
					v-for="tab in tabs"
					:key="tab.props.key"
					:data-key="tab.props.key"
					:ref="tab.props.key"
					:class="{ selected: tab === currentTab }"
					@click.stop="selectTab(tab)"
					@click.middle="closeTab(tab)"
				>
					{{ tab.props.title }}
					<i
						v-if="tab.props.closable"
						aria-hidden="true"
						class="material-icons close"
						title="close"
						@click.stop="closeTab(tab)"
					>
						close
					</i>
				</li>
			</transition-group>
		</draggable>
		<div class="tabcontent">
			<div
				class="tabcontent"
				v-for="tab in tabs"
				:key="tab.props.key"
				v-show="tab === currentTab"
			>
				<component
					ref="editor"
					:is="tab.component"
					v-bind="tab.props"
					@title-changed="tab.props.title = $event"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
	name: 'VirplugsTabs',
	components: {
		draggable,
	},
	props: {
		tabs: {
			type: Array,
			default: () => [],
		},
		currentTab: {
			type: Object,
			default: () => null,
		},
	},
	data: function () {
		return {
			prevTab: null,
			hasFocus: false,
			drag: false,
		};
	},
	watch: {
		currentTab: function (val, oldVal) {
			//console.log('new: %s, old: %s', val, oldVal);
			if (!val) {
				return;
			}

			this.$nextTick(() => {
				this.$refs[val.props.key][0].scrollIntoView({
					behavior: 'smooth',
				});
				this.$emit('tabChange', {
					val,
					comp: this.getCurrentTab(),
				});
				//console.log(this.$refs[val.props.key][0]);
			});
		},
	},
	computed: {
		dragOptions() {
			return {
				animation: 200,
				group: 'description',
				disabled: false,
				ghostClass: 'ghost',
			};
		},
	},
	methods: {
		selectTab(tab) {
			this.prevTab = this.currentTab;
			this.myCurrentTab = tab;
			this.$emit('update:currentTab', tab);
			this.$el.focus();

			// this.$nextTick(() => {
			// 	console.log("switching to ", this.$refs.editor[0]._props.filename);
			// });
		},

		closeTab(tab) {
			if (!tab.props.closable) {
				return;
			}
			const index = this.tabs.indexOf(tab);
			//this.tabs = this.tabs.filter(t => t !== tab);
			this.$emit(
				'update:tabs',
				this.tabs.filter(t => t !== tab)
			);

			// If we weren't collapsed, select another tab
			this.currentTab &&
				this.$nextTick(() => {
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
	mounted: function () {
		// this.$el.addEventListener('wheel', (e) => {
		// 	this.$refs.tabbarul.scrollLeft += e.deltaY;
		// });
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
@import '../styles/vars.less';

.tabs {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
	background: #2a2a2a;

	&:focus {
		outline: none;
	}

	.tabbar {
		border-bottom: 1px solid #202020;
		display: flex;
		z-index: 11;
		margin: 0;
		padding: 0;
		overflow-x: hidden;

		&::-webkit-scrollbar {
			height: 4px;
			background-color: transparent;
		}

		&::-webkit-scrollbar *,
		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgba(255, 255, 255, 0.15);
		}

		&:hover {
			overflow-x: overlay;
		}

		li {
			list-style: none;
			display: inline-block;
			line-height: 36px;
			font-size: 15px;
			background: #2a2a2a;
			padding: 0 10px;
			border-right: 1px solid #202020;
			white-space: nowrap;
			position: relative;
			padding-right: 32px;
			color: #8d8d8d;

			&:hover {
				background: rgba(0, 0, 0, 0.25);
			}

			.close {
				position: absolute;
				right: 8px;
				top: 8px;
				font-size: 16px;
				display: none;
			}

			&:hover .close,
			&.selected .close {
				display: inherit;
			}

			&.selected {
				background: #353535;
				color: #b5b2b1;
			}
		}

		.buttons {
			display: flex;
			flex: 0;
			text-align: right;

			.button {
				margin-right: 6px;

				&:hover {
					color: white;
				}

				&:active {
					color: #aaa;
				}
			}
		}
	}

	.tabcontent {
		flex: 1;
		min-height: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	&.hasFocus .tabbar {
		border-bottom-color: @colorPrimaryHighlight;

		ul li.selected {
			background: @colorPrimaryHighlight;
			color: white;
		}
	}

	&.isEmpty .tabbar {
		border-bottom-color: transparent;
	}

	/* stylelint-disable no-descending-specificity */
	&.small {
		.tabbar ul li {
			line-height: 24px;

			.close {
				top: 5px;
			}
		}

		.buttons {
			height: 24px;
		}
	}
	/* stylelint-enable no-descending-specificity */
}
</style>
