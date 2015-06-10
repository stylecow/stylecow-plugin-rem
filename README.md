stylecow plugin rem
===================

[![Build Status](https://travis-ci.org/stylecow/stylecow-plugin-rem.svg)](https://travis-ci.org/stylecow/stylecow-plugin-rem)

Stylecow plugin to add a fallback in pixels for browsers not supporting rem values. [More info about rem](http://snook.ca/archives/html_and_css/font-size-with-rem)

You write:

```css
p {
	font-size: 2rem;
}
```

And stylecow converts to:

```css
p {
	font-size: 32px;
	font-size: 2rem;
}
```

To change the default value of rem (16px) just create a `font-size` declaration in a `:root` or `html` rule:

```css
:root {
	font-size: 0.5em;
}
p {
	font-size: 2rem;
}
```

becomes to:

```css
:root {
	font-size: 0.5em;
}
p {
	font-size: 16px;
	font-size: 2rem;
}
```

More demos in [the tests folder](https://github.com/stylecow/stylecow-plugin-rem/tree/master/tests/cases)
