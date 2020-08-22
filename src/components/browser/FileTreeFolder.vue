<template>
	<section>
		<div
			class="itemset"
			v-for="file in files"
			:key="file.name"
		>
			<div
				class="item"
				:class="{selected: selectedFiles && selectedFiles.includes(file)}"
				:style="`padding-left: ${40 + depth * 16}px`"
				@mousedown="$emit('select', file, $event)"
				@dblclick="action(file, $event)"
			>
				<template v-if="file.type === 'directory'">
					<img
						class="expander"
						src="@/assets/icons/triangle.svg"
						@mousedown.stop="file.isExpanded = !file.isExpanded"
						:class="{expanded: file.isExpanded}"
					>
					<img class="icon" src="@/assets/icons/folder.svg">
				</template>
				<template v-else>
					<img class="icon" v-if="file.type === 'audio'" src="@/assets/icons/wave.svg">
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

const fs = __non_webpack_require__('fs');
const path = __non_webpack_require__('path');

export default {
	name: "FileTreeFolder",
	components: {

	},
	props: {
		path: {
			type: String,
			required: true
		},
		selectedFiles: {
			type: Array,
			default: () => []
		},
		depth: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			files: [],
		};
	},
	methods: {
		select(file, $event) {
			this.$emit('select', file, $event)
		},
		action(file, $event) {
			if (file.type === 'directory') {
				file.isExpanded = !file.isExpanded
			}
		}
	},
	mounted() {
		console.log("Opened folder", this.path);
		fs.readdir(this.path, { withFileTypes: true }, (err, files) => {
			for (let file of files) {
				this.files.push({
					name: file.name,
					path: path.join(this.path, file.name),
					type: file.isDirectory() ? 'directory' : 'audio',
					isExpanded: false
				});
			}
		});
	}
};
</script>
