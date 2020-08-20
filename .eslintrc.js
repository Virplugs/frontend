module.exports = {
	root: false,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/strongly-recommended',
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		"vue/html-indent": ["warn", "tab", {
			"attribute": 1,
			"baseIndent": 1,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": []
		}],
		"vue/max-attributes-per-line": ["warn", {
			"singleline": 4,
			"multiline": {
				"max": 1,
				"allowFirstLine": false
			}
		}],
		"vue/max-len": [
			"warn",
			{
				"code": 100,
				"tabWidth": 4,
				"ignoreStrings": true
			}
		],
	},
	globals: {
		"nodeRequire": "readonly"
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)'
			],
			env: {
				mocha: true
			}
		}
	]
};
