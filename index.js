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

				root.getChildren({
					type: 'Rule'
				})
				.forEach(function (rule) {
					if (
						rule
						.getChild('Selectors')
						.has({
							type: 'Selector',
							string: [':root', 'html']
						})
					) {
						rule.getChild({
							type: 'Block'
						}).getChildren({
							type: 'Declaration',
							name: 'font-size'
						}).forEach(function (declaration) {
							rem = toPixels(declaration.get('Unit'));
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
				if (declaration.has({
					type: 'Unit',
					name: 'rem'
				})) {
					declaration
						.cloneBefore()
						.getAll({
							type: 'Unit',
							name: 'rem'
						})
						.forEach(function (unit) {
							unit.name = 'px';
							unit.get('Number').name *= unit.getData('rem');
						});
				}
			}
		});
	});
};

function toPixels (unit) {
	var number = unit.get('Number');

	if (unit.name === 'px') {
		return number.name;
	}

	if (unit.name === 'em') {
		return number.name * 16;
	}

	if (unit.name === 'pt') {
		return number.name * 14;
	}

	if (unit.name === '%') {
		return number.name / 100 * 16;
	}

	return 16;
};
