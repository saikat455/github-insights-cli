#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { createAnalyzeCommand } from './commands/analyze';

// Display banner
console.log(
    chalk.blue(
        figlet.textSync('GitHub Insights', {
            font: 'Small',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        })
    )
);

console.log(chalk.gray('A CLI tool to analyze GitHub repositories\n'));

// Setup CLI
program
    .name('github-insights')
    .description('CLI tool to analyze GitHub repositories and generate insights')
    .version('1.0.0');

// Add commands
program.addCommand(createAnalyzeCommand());

// Handle unknown commands
program.on('command:*', () => {
    console.error(chalk.red('Invalid command: %s\n'), program.args.join(' '));
    program.help();
});

// Parse arguments
program.parse();