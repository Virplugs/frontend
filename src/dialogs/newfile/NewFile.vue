<template>
	<div class="maincontainer">
		<div class="titlebar">
			<div class="title">
				Please select a filetype and enter a filename.
			</div>
		</div>

		<form @submit.prevent="ok" method="get" id="frm" name="frm">
			<div class="selectioncontainer">
				<div class="typeselection" id="typeselection">
					<label
						v-for="filetype in filetypes"
						:key="filetype.id"
						:class="{selected:currentFiletype === filetype}"
					>
						<input
							type="radio"
							v-model="currentFiletype"
							:value="filetype"
						>
						{{ filetype.label }}
					</label>
				</div>
				<div class="typedetails">
					<p>
						<strong>Type: </strong>
						<span id="type-label">
							{{ currentFiletype ? currentFiletype.label : '' }}
						</span>
					</p>
					<p id="type-description">
						{{ currentFiletype ? currentFiletype.description : '' }}
					</p>
				</div>
			</div>

			<div class="fn">
				<label for="filename" id="basename-label">
					{{
						currentFiletype && currentFiletype.basename_label ?
							currentFiletype.basename_label :
							'Filename'
					}}:
				</label>
				<input
					type="text"
					v-model="filename"
					class="filename"
				>
			</div>

			<div class="buttons">
				<button class="button" type="button" @click="close">
					Cancel
				</button>
				<button
					class="button"
					type="submit"
					id="okbutton"
					:disabled="filename.length === 0"
				>
					OK
				</button>
			</div>
		</form>
	</div>
</template>

<script>

const remote = nodeRequire('electron').remote;
const process = remote.require('process');

import * as feather from "feather-icons";

import * as createFile from '@/createfile_worker.js';

export default {
	name: "NewFile",
	components: {
	},
	props: {
		rootDir: {
			type: String,
			default: ''
		}
	},
	data: function () {
		return {
			platform: process.platform,
			filetypes: require('@/dialogs/newfile/filetypes.json'),
			currentFiletype: null,
			filename: ""
		};
	},
	watch: {
		currentFiletype(val) {
			this.filename = val.default_basename;
		}
	},
	mounted: function () {
		this.currentFiletype = this.filetypes[0];

		this.$nextTick(function () {
			// Code that will run only after the entire view has been rendered
			feather.replace();
		});
	},
	updated() {
	},
	created() {
	},
	destroyed() {
	},
	methods: {
		close() {
			this.$parent.closePortal();
		},

		ok() {
			if (createFile.createFile({
				basename: this.filename,
				definition: this.currentFiletype,
				directory: this.rootDir
			})) {
				this.$parent.closePortal();
			}
			return false;
		}
	}
};
</script>

<style lang="less" scoped>
@import "~material-design-icons/iconfont/material-icons.css";
@import "@/styles/nativewidgets.less";

.maincontainer {
	background: rgb(44, 34, 39);
	background:
		linear-gradient(
			145deg,
			rgb(36, 33, 37) 0%,
			rgb(76, 74, 80) 100%
		);
	font-family: "Segoe UI", Roboto, sans-serif;
	font-size: 16px;
	color: #ccc;
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	-webkit-subpixel-antialiasing: none;
	overflow: hidden;
}

div {
	user-select: none;
}

.titlebar {
	background: none;
	position: relative;
	padding: 20px;
	flex: 0 0 0;
}

.titlebar .title {
	position: relative;
	top: 0;
	left: 0;
}

.platform-darwin .titlebar {
	flex-basis: auto;
	padding: 12px;
}

.platform-darwin .titlebar .title {
	top: 0;
}

form {
	font-size: 13px;
	margin: 0;
	flex: 2 0;
	display: flex;
	flex-direction: column;
	min-height: 220px;
}

.fn {
	margin: 10px;
	display: flex;
}

.type,
.fn label {
	display: block;
	line-height: 27px;
	flex: 0 0;
	margin-right: 20px;
	white-space: nowrap;
}

input[type="radio"] {
	margin-left: 0;
}

.buttons {
	margin: 10px;
	text-align: right;
}

.filename {
	flex: 2 0;
	background: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 0 4px;
	border: none;
	height: 28px;
}

.filename:focus {
	outline: none;
}

.selectioncontainer {
	display: flex;
	flex: 2 2;
	min-height: 20px;
}

.typeselection {
	flex: 2 0;
	background: rgba(0, 0, 0, 0.5);
	padding: 2px;
	overflow-x: hidden;
	overflow-y: hidden;
}

.typeselection:hover {
	overflow-y: scroll;
}

.typedetails {
	flex: 0 0 200px;
	background: rgba(0, 0, 0, 0.5);
	margin-left: 4px;
	padding: 0 8px;
}

.typeselection label {
	display: block;
	padding: 8px;
}

.typeselection label:hover {
	background: rgba(255, 255, 255, 0.03);
}

.typeselection label.selected {
	background: rgba(255, 255, 255, 0.15);
}

.typeselection label input {
	display: none;
}
</style>

