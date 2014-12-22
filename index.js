module.exports = function (stylecow) {

	stylecow.forBrowsersLowerThan({
		firefox: 3.6,
		explorer: 9.0,
		safari: 5.0,
		opera: 11.6,
		ios: 4.0
	}, function () {

		stylecow.addTask({
			fn: function (root) {
				var rem = 16;

				root.children({
					type: 'Rule'
				})
				.forEach(function (rule) {
					var isroot = rule.firstChild({
							type: 'Selectors'
						}).has({
							type: 'Selector',
							string: [':root', 'html']
						});

					if (isroot) {
						rule.firstChild({
							type: 'Block'
						}).children({
							type: 'Declaration',
							name: 'font-size'
						}).forEach(function (declaration) {
							rem = toPixels(declaration.join(','));
						});
					}
				});

				root.setData('rem', rem);
			}
		});


		//Add the fallback
		stylecow.addTask({
			filter: {
				type: 'Declaration'
			},
			fn: function (declaration) {
				var code = declaration.toString();

				if (code.indexOf('rem') === -1) {
					return false;
				}

				declaration.before(stylecow.Declaration.createFromString(code.replace(/([0-9\.]+)rem/, function (match) {
					if (match[0] === '.') {
						match = '0' + match;
					}

					return (declaration.getData('rem') * parseFloat(match, 10)) + 'px';
				})));
			}
		});
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
