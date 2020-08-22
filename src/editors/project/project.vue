<template>
	<div class="editor">
		<Virplugs-Page-Chooser>
			<div class="page general" title="General">
				<section>
					<header>
						<i
							aria-hidden="true"
							class="material-icons"
						>keyboard_arrow_down</i> Identity
					</header>
					<main>
						<label>
							<span>Display Name</span>
							<input name="displayname" v-model="projectData.identity.displayName">
						</label>
						<label>
							<span>Bundle Identifier</span>
							<input
								name="bundleid"
								class="monospace"
								v-model="projectData.identity.bundleId"
							>
						</label>
						<label>
							<span>Version</span>
							<input name="version" v-model="projectData.identity.version">
						</label>
						<label>
							<span>Build</span>
							<input name="build" v-model="projectData.identity.build">
						</label>
					</main>

					<header>
						<i
							aria-hidden="true"
							class="material-icons"
						>keyboard_arrow_down</i> Company
					</header>
					<main>
						<label>
							<span>Name</span>
							<input name="companyName" v-model="projectData.identity.companyName">
						</label>
						<label>
							<span>Website</span>
							<input
								name="companyWeb"
								v-model="projectData.identity.companyWeb"
							>
						</label>
						<label>
							<span>Email</span>
							<input name="companyEmail" v-model="projectData.identity.companyEmail">
						</label>
					</main>
				</section>
			</div>
			<div title="Plugin Parameters" class="page">
				<VirplugsEditorProjectParameters :parameters="projectData.parameters" />
			</div>
			<div title="Build Settings" class="page">
				hallo
			</div>
			<div title="Packaging" class="page">
				hallo
			</div>
		</Virplugs-Page-Chooser>
	</div>
</template>

<script>
const fs = __non_webpack_require__('fs');

import VirplugsPageChooser from '@/components/PageChooser.vue';
import VirplugsEditorProjectParameters from './parameters.vue';

export default {
	name: 'VirplugsEditorProject',
	components: {
		VirplugsPageChooser,
		VirplugsEditorProjectParameters
	},
	props: {
		filename: {
			type: String,
			required: true,
			default: null
		}
	},
	data: function() {
		return {
			projectData: { identity: { } }
		};
	},
	methods: {
		onResize(e) {

		},
		save() {
			fs.writeFile(this.filename, JSON.stringify(this.projectData),
				{ encoding: "utf8" },
				(err) => {
					if (err) {
						console.err(err);
					} else {
						console.log(this.filename + " saved");
					}
				});
			console.dir(this.projectData);
		},
		focus() {

		}
	},
	beforeCreate() {

	},
	created() {

	},
	destroyed() {

	},
	updated() {

	},
	activated() {

	},
	mounted() {
		let data = fs.readFileSync(this.filename, {encoding: "utf8"});
		let obj = JSON.parse(data.toString());
		this.projectData = obj;

		// this.projectData.identity.displayName = 'hoi';
		// this.hi = 'sdf';
		//this.$set(this.projectData.identity, 'displayName', 'sdf');
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../styles/vars.less";

.editor {
	flex: 1;
	min-height: 0;
	cursor: default;
	padding-top: 2px;
	background: @colorPanelToolbarBackground;
	display: flex;
}

.page {
	flex: 1;
}

.general {
	padding: 20px;
	font-size: 14px;
	overflow: hidden;
	margin-right: 10px;

	&:hover {
		margin-right: 0;
		overflow-y: scroll;
	}

	section {
		display: block;
		margin: auto;
		max-width: 500px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		padding: 0 10%;
		padding-bottom: 14px;
		margin-bottom: 14px;

		header {
			font-weight: 700;

			i.material-icons {
				font-size: 16px;
				position: relative;
				top: 4px;
			}
		}

		main {
			margin-top: 20px;
		}

		label {
			display: flex;
			margin-bottom: 10px;

			span {
				text-align: right;
				display: block;
				flex: 2;
				font-weight: 400;
				margin-right: 14px;
			}

			input {
				text-align: left;
				display: block;
				flex: 5;
				background: #242527;
				color: #ccc;
				border: none;

				/* border-bottom: 1px solid #4e4f50; */
				&.monospace {
					font-family: "Segoe UI Mono", "Consolas", "Menlo", monospace;
				}

				&:focus {
					outline: none;
					border-bottom: 1px solid rgba(255, 255, 255, 0.397);
				}
			}
		}
	}
}

</style>
