const path = require('path');

module.exports = {
	target: 'node',
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: './electron.js',
	output: {
		filename: 'electron.js',
		path: path.resolve(__dirname, 'dist'),
	},
	externals: {
		electron: 'commonjs electron',
		'vue-devtools': 'commonjs vue-devtools',
	},
	resolve: {
		symlinks: false,
	},
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},
};
