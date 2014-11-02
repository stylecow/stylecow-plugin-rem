module.exports = function (stylecow) {

	stylecow.addTask({
		disable: {
			firefox: 3.6,
			explorer: 9.0,
			safari: 5.0,
			opera: 11.6,
			ios: 4.0
		},

		//Set the default value of a rem (16px)
		RootBefore: function (root) {
			root.setData('rem', 16);
		},

		//Changes the default value on :root or html selectors
		RuleBefore: function (rule) {
			if (rule.hasChild({type: 'Selector', string: [':root', 'html']})) {
				rule.children({type: 'Declaration', name: 'font-size'}).forEach(function (declaration) {
					rule.parent({type: 'Root'}).setData('rem', toPixels(declaration.getContent().join(', ')));
				});
			}
		},

		//Add the fallback
		Declaration: function (declaration) {
			var value = declaration.getContent().join(', ');

			if (value.indexOf('rem') === -1) {
				return false;
			}

			declaration.cloneBefore().setContent(value.replace(/([0-9\.]+)rem/, function (match) {
				if (match[0] === '.') {
					match = '0' + match;
				}

				return (declaration.getData('rem') * parseFloat(match, 10)) + 'px';
			}));
		}
	});
};

function toPixels (value) {
	if (value[0] === '.') {
		value = '0' + value;
	}

	if (value.indexOf('px') !== -1) {
		return parseInt(value, 10);
	}

	if (value.indexOf('em') !== -1) {
		return parseFloat(value, 10) * 16;
	}

	if (value.indexOf('pt') !== -1) {
		return parseFloat(value, 10) * 14;
	}

	if (value.indexOf('%') !== -1) {
		return parseFloat(value, 10)/100 * 16;
	}

	return 16;
};
