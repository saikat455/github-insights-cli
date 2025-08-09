import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import { writeFile } from 'fs-extra';
import { GitHubService } from '../services/github';
import { PDFService } from '../services/pdf';
import { parseRepositoryUrl, formatStats, showError, showSuccess, showInfo } from '../utils/helpers';
import { CLIOptions } from '../types';

export function createAnalyzeCommand(): Command {
    return new Command('analyze')
        .description('Analyze a GitHub repository and generate insights')
        .argument('<repository>', 'GitHub repository (owner/repo or full URL)')
        .option('-o, --output <path>', 'Output directory for reports', './reports')
        .option('-f, --format <format>', 'Output format: json, pdf, or both', 'both')
        .option('-t, --token <token>', 'GitHub personal access token for higher rate limits')
        .action(async (repository: string, options: CLIOptions) => {
            const spinner = ora('Parsing repository...').start();

            try {
                // Parse repository URL/name
                const parsed = parseRepositoryUrl(repository);
                if (!parsed) {
                    spinner.fail();
                    showError('Invalid repository format. Use "owner/repo" or GitHub URL');
                    return;
                }

                const { owner, repo } = parsed;
                spinner.text = `Analyzing ${owner}/${repo}...`;

                // Initialize services
                const githubService = new GitHubService(options.token);
                const pdfService = new PDFService();

                // Fetch repository data
                spinner.text = 'Fetching repository data...';
                const stats = await githubService.analyzeRepository(owner, repo);

                spinner.succeed('Repository analysis completed!');

                // Display results
                formatStats(stats);

                // Generate reports
                const outputDir = options.output || './reports';
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const baseFileName = `${owner}-${repo}-${timestamp}`;

                const reports: string[] = [];

                if (options.format === 'json' || options.format === 'both') {
                    const jsonPath = path.join(outputDir, `${baseFileName}.json`);
                    await writeFile(jsonPath, JSON.stringify(stats, null, 2));
                    reports.push(jsonPath);
                    showSuccess(`JSON report saved: ${jsonPath}`);
                }

                if (options.format === 'pdf' || options.format === 'both') {
                    const pdfPath = path.join(outputDir, `${baseFileName}.pdf`);
                    await pdfService.generateReport(stats, pdfPath);
                    reports.push(pdfPath);
                    showSuccess(`PDF report saved: ${pdfPath}`);
                }

                if (reports.length > 0) {
                    showInfo(`Reports generated in: ${outputDir}`);
                }

            } catch (error: any) {
                spinner.fail();
                showError(error.message);
                process.exit(1);
            }
        });
}