# GitHub Insights CLI

A command-line tool built with Node.js and TypeScript that analyzes GitHub repositories and generates comprehensive reports.

## Features

- Analyze GitHub repositories with detailed statistics
- Generate PDF and JSON reports
- Beautiful console output with colors
- Support for repository URLs or owner/repo format
- Concurrent API calls for fast data retrieval

## Installation

```bash
git clone https://github.com/yourusername/github-insights-cli.git
cd github-insights-cli
npm install
npm run build
```

## Usage

### Basic Commands

```bash
# Analyze a repository
npm run dev analyze facebook/react

# Using owner/repo format
npm run dev analyze microsoft/vscode

# Using full GitHub URL
npm run dev analyze https://github.com/nodejs/node
```

### Options

```bash
# Generate only PDF report
npm run dev analyze jquery/jquery --format pdf

# Generate only JSON report
npm run dev analyze vue/vue --format json

# Custom output directory
npm run dev analyze angular/angular --output ./my-reports

# Combine options
npm run dev analyze facebook/react --format both --output ./reports
```

## Command Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| --output | -o | Output directory for reports | ./reports |
| --format | -f | Report format: json, pdf, or both | both |
| --help | -h | Show help information | - |

## Sample Output

```
Repository Analysis: facebook/react

Basic Information
Name: react
Description: The library for web and native user interfaces
Owner: facebook
Language: JavaScript
Created: 5/29/2013

Statistics
Stars: 228,000
Forks: 46,500
Watchers: 6,700
Commits: 16,234
Contributors: 1,456
Open Issues: 1,089

Languages
JavaScript: 94.3%
TypeScript: 2.1%
CSS: 1.8%

Recent Commits
a1b2c3d Fix issue with useState hook
e4f5g6h Update React DevTools integration
```

## Project Structure

```
github-insights-cli/
├── src/
│   ├── commands/
│   │   └── analyze.ts
│   ├── services/
│   │   ├── github.ts
│   │   └── pdf.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts
├── reports/
├── dist/
├── package.json
└── tsconfig.json
```

## Development

```bash
npm run dev          # Run with ts-node
npm run build        # Compile TypeScript
npm run start        # Run compiled version
npm run watch        # Watch mode
npm run clean        # Clean dist directory
```

## Generated Reports

The tool creates two types of reports:

1. **PDF Report** - Professional layout with all repository data
2. **JSON Report** - Raw data in JSON format for further analysis

Reports are saved with timestamps: `owner-repo-2025-08-09T15-30-45-123Z.pdf`

## Troubleshooting

### Rate Limit Exceeded
Wait for the rate limit to reset or try with a smaller repository.

### PDF Generation Issues
Ensure jsPDF version 2.5.1 is installed:
```bash
npm install jspdf@2.5.1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
