module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
	],
	ignorePatterns: '*.min.js',
	parserOptions: {
		ecmaVersion: 2020,
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
		'no-unused-vars': 0,
		'@typescript-eslint/no-unused-vars': [
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
