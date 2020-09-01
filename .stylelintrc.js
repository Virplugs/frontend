module.exports = {
	extends: 'stylelint-config-standard',
	rules: {
		indentation: [
			'tab',
			{
				severity: 'warning',
			},
		],
		'no-descending-specificity': null,
		'declaration-colon-newline-after': null,
	},
};
