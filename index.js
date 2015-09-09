"use strict";

module.exports = function (stylecow) {
	var rem;
	var support = {
		firefox: 3.6,
		explorer: 9.0,
		safari: 5.0,
		opera: 11.6,
		ios: 4.0
	};

	//rem starts with 16px
	stylecow.addTask({
		forBrowsersLowerThan: support,
		position: 'before',
		fn: function (root) {
			rem = 16;
		}
	});

	//If we find font-size inside :root or html, change the rem value
	stylecow.addTask({
		forBrowsersLowerThan: support,
		filter: 'Rule',
		fn: function (rule) {
			if (rule.hasParent('Root') && rule.getChild('Selectors').has({
				type: 'Selector',
				string: [':root', 'html']
			})) {
				rule.getChild('Block')
				.walkChildren({
					type: 'Declaration',
					name: 'font-size'
				}, function (declaration) {
					rem = toPixels(declaration.get('Unit'));
				});
			}
		}
	});

	//Add the fallback
	stylecow.addTask({
		forBrowsersLowerThan: support,
		filter: 'Declaration',
		fn: function (declaration) {
			if (declaration.has({
				type: 'Unit',
				name: 'rem'
			})) {
				declaration
					.cloneBefore()
					.walk({
						type: 'Unit',
						name: 'rem'
					}, function (unit) {
						unit.name = 'px';
						unit.get('Number').name *= rem;
					});
			}
		}
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
