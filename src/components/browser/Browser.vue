<template>
	<div class="browser">
		<div class="panes">
			<rs-panes
				:allow-resize="true"
				split-to="columns"
				primary="first"
				:size="200"
				resizer-color="#353535"
				:resizer-thickness="0"
				class="pane"
			>
				<main slot="firstPane">
					<h1>
						<img src="@/assets/icons/drag_affordance.svg" class="drag-affordance">
						Browser
					</h1>
					<div class="sections">
						<section>
							<h2>Categories</h2>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Type of Sounds</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Drums</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Instruments</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Audio Effects</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Plug-ins</span>
							</div>
						</section>

						<section>
							<h2>Places</h2>
							<div
								class="item"
								v-for="place in places"
								:key="place.path"
								@mousedown="currentItem = place"
								:class="{selected: currentItem === place}"
							>
								<img src="@/assets/icons/folder.svg">
								<span>{{ place.name }}</span>
							</div>
							<div class="item add" @click="addFolder">
								<img src="@/assets/icons/add.svg">
								<span>Add Folder...</span>
							</div>
						</section>

						<section>
							<h2>Favorites</h2>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Type of Sounds</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Drums</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Instruments</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Audio Effects</span>
							</div>
							<div class="item">
								<img src="@/assets/icons/note.svg">
								<span>Plug-ins</span>
							</div>
						</section>
					</div>
				</main>
				<aside slot="secondPane">
					<div class="searchbox">
						<input placeholder="Search for anything">
					</div>

					<VirplugsFileTree
						v-for="item of places"
						v-show="currentItem === item"
						:key="item.path"
						:path="item.path"
					/>
				</aside>
			</rs-panes>
		</div>
	</div>
</template>

<script>
import ResSplitPane from "vue-resize-split-pane";
import VirplugsFileTree from "@/components/browser/FileTree.vue";
import * as preferences from "@/preferences.js";

export default {
	components: {
		"rs-panes": ResSplitPane,
		VirplugsFileTree
	},
	props: {},
	data() {
		return {
			places: preferences.get("places") || [],
			currentItem: null,
		};
	},
	methods: {
		addFolder() {
			const { dialog } = __non_webpack_require__("electron").remote;
			const path = __non_webpack_require__("path");

			dialog.showOpenDialog(window.win, {
					properties: ["openDirectory"],
				})
				.then((result) => {
					if (result.canceled) return;
					for (let folder of result.filePaths) {
						if (this.places.some(p => p.path === folder)) continue;
						this.places.push({
							path: folder,
							name: path.basename(folder) || folder.replace(/(\\|\/)$/, "")
						});
					}
					preferences.set('places', this.places);
					preferences.commit();
				})
				.catch((err) => {
					console.error(err);
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.browser {
	background: #505050;
	height: 100%;
	padding-top: 2px;
	user-select: none;
	box-sizing: border-box;

	.panes {
		flex: 1;
		height: 100%;
		position: relative;
	}

	main {
		display: flex;
		flex-direction: column;
		height: 100%;
		user-select: none;

		h1 {
			font-size: 15px;
			font-weight: bold;
			margin: 0;
			padding: 24px 10px;
			padding-top: 20px;
			flex: 0;

			.drag-affordance {
				transform: scale(0.75);
				vertical-align: middle;
				margin-right: 10px;
				position: relative;
				top: -1px;
			}
		}

		.sections {
			overflow-y: auto;
			overflow-x: hidden;
			height: 100%;
		}

		section {
			color: #b5b2b1;
			//padding: 0 24px;
			//padding-right: 12px;
			margin-bottom: 24px;

			h2 {
				font-weight: normal;
				font-size: 12px;
				text-transform: uppercase;
				margin: 0 24px;
				margin-bottom: 10px;
				border-bottom: 1px solid #b5b2b1;
				margin-right: 12px;
				padding-bottom: 8px;
			}

			.item {
				line-height: 27px;
				white-space: nowrap;
				padding: 0 24px;
				width: 100%;

				img {
					width: 22px;
					height: 22px;
					vertical-align: middle;
					margin-right: 8px;
					position: relative;
					top: -1px;
				}

				span {
					font-size: 15px;
				}

				&.add {
					cursor: pointer;

					span {
						text-decoration: underline;
					}
				}

				&.selected {
					background: #202020;
				}
			}
		}
	}

	aside {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #353535;
		user-select: none;

		.searchbox {
			background: #202020;
			margin: 0;
			padding: 11px 24px;
			padding-top: 20px;
			flex: 0;

			input {
				border: none;
				background: transparent;
				color: #b5b2b1;
				font-size: 15px;
				font-weight: normal;

				&:focus {
					outline: none;
				}
			}
		}
	}
}
</style>
