#!/usr/bin/env node

global.base_dir = process.cwd();
const Program = require('commander');
const ServerDev = require('../lib/server.js');
const Template = require('../lib/template.js');
const { createConfig, getConfig } = require('../lib/config.js');

Program
	.version('1.0.0')
	.description('CLI Dooca commerce themekit');

Program
	.command('config')
	.alias('c')
	.description('Create config file')
	.action(() => {
		createConfig();
	});

Program
	.command('serve')
	.alias('s')
	.option('-s, --shop <shop>', 'set shop name')
	.option('-t, --theme <theme>', 'set theme name')
	.description('Run serve dev')
	.action(args => {
		getConfig().then((exists) => {
			ServerDev(args.shop, args.theme);
		}).catch(() => {
			createConfig();
		});
	});

Program
	.command('section')
	.description('Create new section file')
	.action(args => {
		if (typeof args === 'string') {
			Template.section(args);
		} else {
			console.log('no args');
		}
	});

Program
	.command('snippet')
	.description('Create new snippet file')
	.action(args => {
		if (typeof args === 'string') {
			Template.snippet(args);
		} else {
			console.log('no args');
		}
	});

Program
	.command('template')
	.description('Create new template file')
	.action(args => {
		if (typeof args === 'string') {
			Template.template(args);
		} else {
			console.log('no args');
		}
	});


Program.parse(process.argv);