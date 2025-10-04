# Contributing guidelines

This is mostly a basic summary; please see the [dev docs](https://ampmod.codeberg.page/manual/dev)
for more information on developing AmpMod packages.

## I don't know JavaScript! / I don't want to create a Codeberg account!

If you don't want to use this repository but still found a bug or want to add a feature, we recommend
posting on the [forums](https://ampmod.flarum.cloud) about it.

## Development environment

To set up the development environment, run `npm i`. You need Node.js installed (v22 and later are
preferred but v18 and later should work fine.)

Note you need Python and Java installed if you want to modify `blocks`.

## Style guide

We use Prettier to format files with this style guide, so if you make a mistake, don't
worry. If you ran `npm i`, changes will be modified to fit the style guide after you make
a commit.

- Files should end with a newline.
- JS statements should have a semicolon at the end.
- Use double quotes.
- To indent, use 4 spaces. This isn't C code from the 90's, so don't use tabs.
- Arrow functions with one parameter will not have paranthesis around that parameter.
- Trailing commas should be included when permitted in ES5.
