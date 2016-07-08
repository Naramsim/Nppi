#!/usr/bin/env node
const meow = require('meow');
const updateNotifier = require('update-notifier');
const nppi = require('./');

const cli = meow(`
		Usage
		  $ nppi <file|dir> [options]
		
		Options
		  --save          Adds the packages to a package.json (you have to create it before npm init)
		  --save-dev      Adds the packages to a package.json as dev-dependencies
		  --recursive     Parses folder recursively
		
		Examples
		  $ nppi .
		  $ nppi index.js
	`);

const input = cli.input;
const opts = cli.flags;

updateNotifier({pkg: cli.pkg}).notify();

nppi.start(opts, input);
