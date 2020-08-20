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

					<h3>Categories</h3>
					<section>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Type of Sounds</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Drums</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Instruments</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Audio Effects</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Plug-ins</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Type of Sounds</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Drums</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Instruments</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Audio Effects</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Plug-ins</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Type of Sounds</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Drums</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Instruments</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Audio Effects</span>
						</div>
						<div class="item">
							<img src="@/assets/icons/triangle.svg">
							<span>Plug-ins</span>
						</div>
					</section>
				</aside>
			</rs-panes>
		</div>
	</div>
</template>

<script>
import ResSplitPane from 'vue-resize-split-pane';

export default {
	components: {
		'rs-panes': ResSplitPane,
	},
	props: {

	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.browser {
	background: #505050;
	height: 100%;
	padding-top: 2px;
	user-select: none;

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
			overflow-y: scroll;
			height: 100%;
		}

		section {
			color: #b5b2b1;
			padding: 0 24px;
			padding-right: 12px;
			margin-bottom: 24px;

			h2 {
				font-weight: normal;
				font-size: 12px;
				text-transform: uppercase;
				margin: 0;
				padding: 0;
				margin-bottom: 10px;
				padding-bottom: 10px;
				border-bottom: 1px solid #b5b2b1;
			}

			.item {
				line-height: 27px;
				white-space: nowrap;

				img {
					transform: scale(0.75);
					vertical-align: middle;
					margin-right: 6px;
					position: relative;
					top: -1px;
				}

				span {
					font-size: 15px;
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

		h3 {
			font-weight: normal;
			font-size: 12px;
			text-transform: uppercase;
			border-bottom: 1px solid #b5b2b1;
			margin: 0 24px;
			margin-top: 18px;
			margin-bottom: 0;
			padding-bottom: 10px;
		}

		section {
			overflow-y: scroll;
			height: 100%;
			color: #b5b2b1;
			padding: 0 24px;
			padding-top: 10px;

			.item {
				line-height: 27px;
				white-space: nowrap;

				img {
					transform: scale(0.75);
					vertical-align: middle;
					margin-right: 6px;
				}

				span {
					font-size: 15px;
				}
			}
		}
	}
}
</style>
