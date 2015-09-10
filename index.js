"use strict";

module.exports = function (tasks) {
    var rem;
    var support = {
        firefox: 3.6,
        explorer: 9.0,
        safari: 5.0,
        opera: 11.6,
        ios: 4.0
    };

    //rem starts with 16px
    tasks.addTask({
        forBrowsersLowerThan: support,
        position: 'before',
        fn: function (root) {
            rem = 16;
        }
    });

    //If we find font-size inside :root or html, change the rem value
    tasks.addTask({
        forBrowsersLowerThan: support,
        filter: 'Rule',
        fn: function (rule) {
            if (rule.hasParent('Root') && rule.getChild('Selectors').has({
                type: 'Selector',
                string: [':root', 'html']
            })) {
                rule
                .getChild('Block')
                .getChildren({
                    type: 'Declaration',
                    name: 'font-size'
                })
                .forEach(declaration => rem = toPixels(declaration.get('Unit')));
            }
        }
    });

    //Add the fallback
    tasks.addTask({
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

    switch (unit.name) {
        case 'px':
            return number.name;

        case 'em':
            return number.name * 16;

        case 'pt':
            return number.name * 14;

        case '%':
            return number.name / 100 * 16;

        default:
            return 16;
    }
};
