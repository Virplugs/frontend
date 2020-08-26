<template>
	<div class="fileinfo">
		<span class="desc">{{ type }}</span>
		{{ filename }}
	</div>
</template>

<script>
const path = require('path');

export default {
	components: {},
	props: {
		file: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
	},
	computed: {
		filename() {
			return path.basename(this.file);
		},
	},
	data() {
		return {
			fileInfo: {},
		};
	},
	watch: {
		file(file) {
			this.openFile(file);
		},
	},
	methods: {
		async openFile(file) {},
	},
};
</script>

<style lang="less">
.fileinfo {
	flex: 0;
	flex-basis: 36px;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	background: #505050;
	border: 1px solid #353535;
	border-bottom: 0;
	border-right: 0;
	padding: 10px;
	box-sizing: border-box;
	font-size: 13px;

	.desc {
		font-weight: 700;
		margin-right: 10px;
		text-transform: capitalize;
	}
}
</style>
