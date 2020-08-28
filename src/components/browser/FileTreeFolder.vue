<template>
	<section>
		<div class="itemset" v-for="file in files" :key="file.name">
			<div
				class="item"
				:class="{ selected: selectedFiles && selectedFiles.includes(file) }"
				:style="`padding-left: ${40 + depth * 16}px`"
				@mousedown="$emit('select', file, $event)"
				@dblclick="action(file, $event)"
				draggable="true"
				@dragstart="dragfilestart(file, $event)"
				@dragend="dragfileend(file, $event)"
			>
				<template v-if="file.type === 'directory'">
					<img
						class="expander"
						src="@/assets/icons/triangle.svg"
						@mousedown.stop="file.isExpanded = !file.isExpanded"
						@dblclick.stop=""
						:class="{ expanded: file.isExpanded }"
					/>
					<img class="icon" src="@/assets/icons/folder.svg" />
				</template>
				<template v-else>
					<img class="icon" v-if="file.type === 'audio'" src="@/assets/icons/wave.svg" />
					<img class="icon" v-else src="@/assets/icons/wave.svg" />
				</template>
				<span>{{ file.name }}</span>
			</div>
			<FileTreeFolder
				v-if="file.isExpanded"
				:path="file.path"
				:selected-files="selectedFiles"
				:depth="depth + 1"
				@select="select"
			/>
		</div>
	</section>
</template>

<script>
const fs = require('fs');
const path = require('path');

export default {
	name: 'FileTreeFolder',
	components: {},
	props: {
		path: {
			type: String,
			required: true,
		},
		selectedFiles: {
			type: Array,
			default: () => [],
		},
		depth: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			files: [],
			showableExtensions: {
				audio: ['wav', 'aiff', 'w64', 'caf', 'flac', 'ogg', 'aif', 'au'],
			},
		};
	},
	methods: {
		select(file, $event) {
			this.$emit('select', file, $event);
		},
		action(file, $event) {
			if (file.type === 'directory') {
				file.isExpanded = !file.isExpanded;
			}
		},
		getFiletype(file) {
			return Object.keys(this.showableExtensions).find(k =>
				this.showableExtensions[k].some(
					ext => path.extname(file).toLowerCase() === `.${ext}`
				)
			);
		},
		dragfilestart(file, $event) {
			// hide drag area thingy
			$event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
			$event.dataTransfer.setData('text/virplugs-inode', JSON.stringify(file));
			$event.dataTransfer.setData(
				'text/virplugs-inode/name:' + path.parse(file.path).name,
				'x'
			);
		},
		dragfileend(file, $event) {},
	},
	mounted() {
		console.log('Opened folder', this.path);
		fs.readdir(this.path, { withFileTypes: true }, (err, files) => {
			for (let file of files) {
				const type = file.isDirectory() ? 'directory' : this.getFiletype(file.name);
				if (type) {
					this.files.push({
						name: file.name,
						path: path.join(this.path, file.name),
						type: type,
						isExpanded: false,
					});
				}
			}
		});
	},
};
</script>
