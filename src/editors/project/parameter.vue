<template>
	<li class="template editing">
		<div class="title" @click="isCollapsed = !isCollapsed">
			<i aria-hidden="true" class="material-icons collapser">
				{{ isCollapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down' }}
			</i>
			<span class="title-text">
				{{ parameter.title === '' ? '(New parameter)' : parameter.title }}
			</span>
			<span class="title-lens" />
			<i
				aria-hidden="true"
				class="button material-icons delete"
				title="Delete"
				@click.stop="$emit('delete')"
			>
				delete
			</i>
			<i
				aria-hidden="true"
				class="button material-icons duplicate"
				title="Duplicate"
				@click.stop="$emit('duplicate')"
			>
				content_copy
			</i>
		</div>
		<main v-show="!isCollapsed">
			<div class="table">
				<div class="table-head">
					<div class="table-head-cell">Key</div>
					<div class="table-head-cell">Value</div>
				</div>
				<div class="table-row">
					<div class="table-cell">Title</div>
					<div class="table-cell">
						<input name="title" v-model="parameter.title" />
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">Short Title</div>
					<div class="table-cell">
						<input name="shortTitle" v-model="parameter.shortTitle" />
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">Units</div>
					<div class="table-cell">
						<input name="units" v-model="parameter.units" />
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">Step Count</div>
					<div class="table-cell">
						<input name="stepCount" v-model="parameter.stepCount" />
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">Default Normalized Value</div>
					<div class="table-cell">
						<input
							name="defaultNormalizedValue"
							v-model="parameter.defaultNormalizedValue"
						/>
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">is Read Only</div>
					<div class="table-cell">
						<input
							name="flagIsReadOnly"
							type="checkbox"
							v-model="parameter.flagIsReadOnly"
						/>
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">is Wrap Around</div>
					<div class="table-cell">
						<input
							name="flagIsWrapAround"
							type="checkbox"
							v-model="parameter.flagIsWrapAround"
						/>
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">is List</div>
					<div class="table-cell">
						<input name="flagIsList" type="checkbox" v-model="parameter.flagIsList" />
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">is Program Change</div>
					<div class="table-cell">
						<input
							name="flagIsProgramChange"
							type="checkbox"
							v-model="parameter.flagIsProgramChange"
						/>
					</div>
				</div>
				<div class="table-row">
					<div class="table-cell">is Bypass</div>
					<div class="table-cell">
						<input
							name="flagIsBypass"
							type="checkbox"
							v-model="parameter.flagIsBypass"
						/>
					</div>
				</div>
			</div>
		</main>
	</li>
</template>

<script>
import $ from 'jquery';

export default {
	name: 'VirplugsEditorProjectParameter',
	components: {},
	props: {
		collapsed: {
			type: Boolean,
			default: true,
		},
		parameter: {
			type: Object,
			default: () => {},
			required: true,
		},
	},
	data: function () {
		return {
			isCollapsed: false,
		};
	},
	methods: {},
	mounted() {
		this.isCollapsed = this.collapsed;
		$(this.$el)
			.find('.table input')
			.on('focus', function () {
				$(this).closest('.table-row').addClass('focus');
			});
		$(this.$el)
			.find('.table input')
			.on('blur', function () {
				$(this).closest('.table-row').removeClass('focus');
			});
		$(this.$el)
			.find('.table-row')
			.click(function () {
				$(this).find('input')[0].focus();
			});
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../styles/vars.less';

.title {
	position: relative;
}

.title i.delete {
	position: absolute;
	right: 2px;
	font-size: 16px;
	top: 2px;
}

.title i.duplicate {
	position: absolute;
	right: 22px;
	font-size: 16px;
	top: 2px;
}

.title i.delete:hover {
	color: rgb(226, 158, 158);
}

.title i.duplicate:hover {
	color: rgb(255, 255, 255);
}

li {
	padding: 5px;
	display: block;
	border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	overflow-x: hidden;
}

li .title {
	font-size: 14px;
	white-space: nowrap;
}

li .title .title-text {
	font-weight: 500;
}

li .title i.material-icons.collapser {
	font-size: 16px;
	position: relative;
	top: 4px;
}

li .title .title-lens {
	color: #777;
	font-family: 'Segoe UI Mono', 'Consolas', 'Menlo', monospace;
	margin-left: 20px;
	position: relative;
	white-space: nowrap;
	width: 1px;
	font-size: 13px;
	display: inline-block;
	transition: opacity 200ms;
}

li.editing .title .title-lens {
	opacity: 0;
}

main {
	padding: 10px;
}

.table {
	max-width: 800px;
	margin-bottom: 4px;
}

li main a {
	cursor: pointer;
	margin-right: 10px;
}

.table-head {
	background-color: #242527;
	display: flex;
	font-size: 11px;
	border-bottom: 1px solid rgb(63, 63, 63);
}

.table-head .table-head-cell {
	flex: 1;
	padding: 4px;
}

.table-row {
	display: flex;
}

.table-cell {
	flex: 1;
	font-size: 12px;
	line-height: 20px;
	height: 20px;
}

.table-cell:first-child {
	padding-left: 8px;
}

.table-cell input {
	border: none;
	background: transparent;
	color: #ccc;
	height: 20px;
	line-height: 20px;
	width: 100%;
}

.table-cell input[type='checkbox'] {
	width: auto;
	height: auto;
	font-family: 'Segoe UI Mono', 'Consolas', 'Menlo', monospace;
	font-size: 13px;
	line-height: 13px;
}

.table-cell input[type='checkbox']::after {
	content: 'false';
	margin-left: 20px;
}

.table-cell input[type='checkbox']:checked::after {
	content: 'true';
}

.table-cell input:focus {
	outline: none;
	background: rgba(0, 0, 0, 0.1);
}

.table-row.focus {
	background: rgba(71, 149, 212, 0.15);
}

.table-row:active {
	background: rgba(71, 149, 212, 0.1);
}
</style>
