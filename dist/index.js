#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const analyze_1 = require("./commands/analyze");
// Display banner
console.log(chalk_1.default.blue(figlet_1.default.textSync('GitHub Insights', {
    font: 'Small',
    horizontalLayout: 'default',
    verticalLayout: 'default'
})));
console.log(chalk_1.default.gray('A CLI tool to analyze GitHub repositories\n'));
// Setup CLI
commander_1.program
    .name('github-insights')
    .description('CLI tool to analyze GitHub repositories and generate insights')
    .version('1.0.0');
// Add commands
commander_1.program.addCommand((0, analyze_1.createAnalyzeCommand)());
// Handle unknown commands
commander_1.program.on('command:*', () => {
    console.error(chalk_1.default.red('Invalid command: %s\n'), commander_1.program.args.join(' '));
    commander_1.program.help();
});
// Parse arguments
commander_1.program.parse();
//# sourceMappingURL=index.js.map