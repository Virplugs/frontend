// use this file to declare modules that are untyped

declare module '!!raw-loader!*' {
	const contents: string;
	export = contents;
}

declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}

declare module "less-vars-to-js";
declare module "vue-resize-split-pane";
