module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/strongly-recommended',
		'plugin:prettier/recommended',
		'prettier',
		'prettier/vue',
	],
	ignorePatterns: '*.min.js',
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 8,
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/html-indent': [
			'warn',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/max-attributes-per-line': [
			'warn',
			{
				singleline: 4,
				multiline: {
					max: 1,
					allowFirstLine: false,
				},
			},
		],
		'vue/max-len': [
			'warn',
			{
				code: 100,
				tabWidth: 4,
				ignoreStrings: true,
			},
		],
		'no-unused-vars': [
			'warn',
			{
				vars: 'all',
				args: 'none',
				ignoreRestSiblings: false,
			},
		],
		semi: ['error', 'always'],
		curly: ['warn', 'all'],
		'max-len': [
			'warn',
			{
				code: 100,
				tabWidth: 4,
				ignoreStrings: true,
			},
		],
		'eol-last': ['warn', 'always'],
		'no-trailing-spaces': ['warn'],
		'comma-dangle': ['warn', 'only-multiline'],
	},
};
