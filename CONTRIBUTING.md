# Contributing guidelines

## I don't know JavaScript! / I don't want to create a Codeberg account!

If you don't want to use this repository but still found a bug or want to add a feature, we recommend
posting on the [forums](https://ampmod.flarum.cloud) about it.

## Development environment

To set up the development environment, run `pnpm i`. You need Node.js installed (v22 and later are
preferred but v18 and later should work fine.)

Note you need Python and Java installed if you want to modify `blocks`.

## Style guide

We use Prettier to format files with this style guide, so if you make a mistake, don't
worry. If you ran `pnpm i`, changes will be modified to fit the style guide after you make
a commit.

- Files should end with a newline.
- JS statements should have a semicolon at the end.
- Use double quotes.
- To indent, use 4 spaces. This isn't C code from the 90's, so don't use tabs.
- Arrow functions with one parameter will not have paranthesis around that parameter.
- Trailing commas should be included when permitted in ES5.

## Scope

### Extensions

New extensions will **not** be added to the core editor. This is against AmpMod's
simplicity-first philosophy. If you want to add an extension, please submit it to
the [extensions repo](https://codeberg.org/ampmod/extensions). Extensions there will
be shown in AmpMod's extension library.

The separate extensions repository allows us to make development of extensions simpler
and allow a separate review process for them.

### Blocks

New blocks are allowed, but only if they fit the following criteria:

- They do not interact with websites outside of AmpMod, TurboWarp, or Scratch
- They fit within one of the existing categories (Motion, Looks, etc.) If not, please
  create an extension for your blocks.
- They are expected to be used by at least 1% of users
- They are not a duplicate of a block from an extension (excluding blocks from TurboWarp
  extensions)

Note that when a new AmpMod version is released, blocks added in it can not be removed,
but they _can_ be hidden from the toolbox. Removing blocks will break projects that
use them.

### Addons

Addons are allowed, but only if they fit the following criteria:

- They do not interact with websites outside of AmpMod
- They are expected to be used by at least 1% of users
- They do not add new blocks (this should be done with extensions). Debugger is an
  exception to this rule.
- They do not corrupt projects
- They use the API from SA (in case addons are ported to that browser extension)

## Cheat sheet

- `pnpm i` - Install dependencies
- `pnpm start` - Start a development server
- `pnpm run build` - Build the project for production
- `prettier --write .` - modify your files to follow our style guide

## Update the credits

If you contribute to AmpMod, you may want to add your username to the credits page.
This is found in `packages/gui/src/playground/credits/users.js`.

If you have a Scratch account, go to your profile and prepend `api.` before `scratch.mit.edu`.
Then, copy the ID next to `"id":` in the JSON, and set it as `userID` in the credits file.
This will add your profile picture and a link to your profile. `username` will also need
to be the same as your Scratch username.

If you do not have a Scratch account, you can set `userID` to `0` and `username` to a nickname
you go by.

Example:

```js
{
    userID: 149550011,
    username: "AmpElectrecuted",
}
```
