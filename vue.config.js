// vue.config.js

const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
	lintOnSave: process.env.NODE_ENV !== 'production',
	configureWebpack: {
		node: {
			global: false,
		},
		plugins: [
			new StyleLintPlugin({
				files: ['src/**/*.{vue,htm,html,css,sss,less,scss,sass}'],
			}),
		],
		resolve: {
			symlinks: false,
		},
		externals: {
			'@virplugs/audioengine': 'commonjs @virplugs/audioengine',
			path: 'commonjs path',
			fs: 'commonjs fs',
			os: 'commonjs os',
			process: 'commonjs process',
			fswin: 'commonjs fswin',
			electron: 'commonjs electron',
		},
		devtool: 'source-map',
		output: {
			devtoolModuleFilenameTemplate: info =>
				info.resourcePath.match(/\.vue$/) && !info.identifier.match(/type=script/)
					? `webpack-generated:///${info.resourcePath}?${info.hash}`
					: `app:///${info.resourcePath.replace(/^\.\//, '')}`,

			devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]',
		},
	},
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	productionSourceMap: false,
	devServer: {
		port: 8123,
	},
};
