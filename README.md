# ![AmpMod](packages/gui/src/website/components/header/ampmod.svg)<br>[![CI status](https://ci.codeberg.org/api/badges/15147/status.svg)](https://ci.codeberg.org/repos/15147) [![Multiple licences, click here for more info](https://img.shields.io/badge/licence-multiple,%20click%20here-blue.svg)](LICENSE.md)

This is the source code for the AmpMod editor. AmpMod (formerly UltiBlocks) is a powerful block-based programming language with things like first-class lists,
making it easier to create larger and more complicated projects.

[![Try AmpMod now!](readme-assets/trynow.svg)](https://ampmod.codeberg.page)

Canary (newest commits): https://ampmod.codeberg.page/canary

## Included packages

The following packages are included in this monorepo:

| Package        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `gui`          | The user interface used to run/create projects.          |
| `vm`           | The package that executes projects and loads extensions. |
| `blocks`       | The package used for the drag-and-drop block interface.  |
| `desktop`      | The desktop app for AmpMod.                              |
| `paint`        | The paint editor for creating costumes and backdrops.    |
| `render-fonts` | A package that contains fonts used in projects.          |
| `branding`     | Self-explanatory. See [Forking](#forking).               |

Most of these packages have been published to our registry (public):
https://codeberg.org/ampmod/-/packages

## Setup

In AmpMod, `pnpm` is used instead of `npm`. If you use `npm` you will receive an error:
```
This project is configured to use pnpm because /path/to/ampmod/package.json has a "packageManager" field
```

Run `pnpm i` in the root directory to install all packages needed.

## Forking

Here are some important recommendations for forks. Since AmpMod is free and open-source, we don't strictly require
you to follow these. However, we recommend you do so.

- **Change the branding of your mod.** This is perhaps the most important change for a fork. Instead of modifying
  `packages/gui/src/lib/brand.js`, you should modify `packages/branding/src/index.js`. You will especially
  want to change `APP_NAME` and `APP_SOURCE`.
- **Create your own accent colour.** We recommend using a colour from the Scratch category palette, or at least a colour
  made to look like it. Some other accent colours like `rainbow` and `grey` already exist; you can use those.
- **Please release your source code.** Not doing so is illegal and violates the GPL/MPL. However, you _are_ allowed to
  use the files outside of `packages` and `.woodpecker` in closed-source projects, as those are under 0BSD.

## Licence

Licencing of each package varies; however, they are all open-source. See [LICENSE.md](LICENSE.md) for more information.
