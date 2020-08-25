<template>
	<div class="filetree">
		<h3>Categories</h3>
		<FileTreeFolder :path="path" @select="select" :selected-files="selectedFiles" />
		<MiniPlayer v-if="selectedFiles.length > 0 && selectedFiles[0].type === 'audio'" :file="selectedFiles[0].path" />
		<FileInfo v-if="selectedFiles.length > 0 && selectedFiles[0].type !== 'audio'" :file="selectedFiles[0].path" :type="selectedFiles[0].type" />
	</div>
</template>

<script>
import * as preferences from "@/preferences.js";
import FileTreeFolder from "./FileTreeFolder.vue";
import MiniPlayer from "./MiniPlayer.vue";
import FileInfo from "./FileInfo.vue";

const fs = __non_webpack_require__('fs');
const path = __non_webpack_require__('path');

export default {
	components: {
		FileTreeFolder,
		MiniPlayer,
		FileInfo
	},
	props: {
		path: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			selectedFiles: []
		};
	},
	methods: {
		select(item, event) {
			if (event.ctrlKey) {
				this.selectedFiles.push(item);
			} else {
				this.selectedFiles = [item];
			}
		}
	},
	mounted() {
	}
};
</script>

<style lang="less">
.filetree {
	height: 100%;
	flex: 2 2;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	h3 {
		font-weight: normal;
		font-size: 12px;
		text-transform: uppercase;
		border-bottom: 1px solid #b5b2b1;
		margin: 0 24px;
		margin-top: 18px;
		margin-bottom: 0;
		padding-bottom: 10px;
		flex: 0;
	}

	> section {
		padding: 10px 0;
	}

	section {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		color: #b5b2b1;

		.item {
			line-height: 27px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-bottom: 1px;
			padding-right: 4px;

			img {
				vertical-align: middle;
			}

			.expander {
				margin-left: -17px;
				width: 8px;
				height: 8px;
				margin-right: 8px;

				&.expanded {
					transform: rotate(90deg);
				}
			}

			.icon {
				width: 16px;
				height: 16px;
				margin-right: 8px;
			}

			span {
				font-size: 15px;
			}

			&.selected {
				background: #202020;
			}
		}
	}
}
</style>
