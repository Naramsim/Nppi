Node Packages Parser Installer
===

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

`nppi` is a tool that lets you parse files searching for their dependencies and install them.
Really useful if you have downloaded a project or a file without its `package.json`.
Super useful if you have downloaded a huge `gulpfile.js` from some [gist](https://gist.github.com/mlouro/8886076).

#### Install

```shell
npm install nppi -g
```

#### Usage

```shell
nppi <file|dir> [options]
```

#### Options

`--save` adds the packages to a package.json (you have to create it before, `npm init`)

`--save-dev` adds the packages to a package.json as dev-dependencies

`--recursive` recursively parse folders.

#### Blacklist

Files contained in `node_modules` and `bower_components` will never be parsed.

#### Examples

```shell
nppi .                         # parses the entire current folder
nppi ./project                 # parses project folder
nppi gulpfile.js --save-dev    # parses gulpfile.js file only, updates package.json
nppi . --recursive --save      # parses current folder and all folders inside it, updates package.json
```