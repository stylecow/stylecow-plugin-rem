module.exports = function (stylecow) {

	var rem;

	stylecow.forBrowsersLowerThan({
		firefox: 3.6,
		explorer: 9.0,
		safari: 5.0,
		opera: 11.6,
		ios: 4.0
	}, function () {

		stylecow.addTask({
			position: 'before',
			fn: function (root) {
				rem = 16;
			}
		});

		stylecow.addTask({
			filter: {
				type: 'Rule'
			},
			fn: function (rule) {
				if (
					rule.parent
				 && rule.parent.type === 'Root'
				 && rule
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
							unit.get('Number').name *= rem;
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
