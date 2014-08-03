stylecow plugin rem
===================

Stylecow plugin to add a fallback in pixels for browsers not supporting rem values.

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