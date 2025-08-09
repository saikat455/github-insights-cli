"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyzeCommand = createAnalyzeCommand;
const commander_1 = require("commander");
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const fs_extra_1 = require("fs-extra");
const github_1 = require("../services/github");
const pdf_1 = require("../services/pdf");
const helpers_1 = require("../utils/helpers");
function createAnalyzeCommand() {
    return new commander_1.Command('analyze')
        .description('Analyze a GitHub repository and generate insights')
        .argument('<repository>', 'GitHub repository (owner/repo or full URL)')
        .option('-o, --output <path>', 'Output directory for reports', './reports')
        .option('-f, --format <format>', 'Output format: json, pdf, or both', 'both')
        .option('-t, --token <token>', 'GitHub personal access token for higher rate limits')
        .action(async (repository, options) => {
        const spinner = (0, ora_1.default)('Parsing repository...').start();
        try {
            // Parse repository URL/name
            const parsed = (0, helpers_1.parseRepositoryUrl)(repository);
            if (!parsed) {
                spinner.fail();
                (0, helpers_1.showError)('Invalid repository format. Use "owner/repo" or GitHub URL');
                return;
            }
            const { owner, repo } = parsed;
            spinner.text = `Analyzing ${owner}/${repo}...`;
            // Initialize services
            const githubService = new github_1.GitHubService(options.token);
            const pdfService = new pdf_1.PDFService();
            // Fetch repository data
            spinner.text = 'Fetching repository data...';
            const stats = await githubService.analyzeRepository(owner, repo);
            spinner.succeed('Repository analysis completed!');
            // Display results
            (0, helpers_1.formatStats)(stats);
            // Generate reports
            const outputDir = options.output || './reports';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const baseFileName = `${owner}-${repo}-${timestamp}`;
            const reports = [];
            if (options.format === 'json' || options.format === 'both') {
                const jsonPath = path.join(outputDir, `${baseFileName}.json`);
                await (0, fs_extra_1.writeFile)(jsonPath, JSON.stringify(stats, null, 2));
                reports.push(jsonPath);
                (0, helpers_1.showSuccess)(`JSON report saved: ${jsonPath}`);
            }
            if (options.format === 'pdf' || options.format === 'both') {
                const pdfPath = path.join(outputDir, `${baseFileName}.pdf`);
                await pdfService.generateReport(stats, pdfPath);
                reports.push(pdfPath);
                (0, helpers_1.showSuccess)(`PDF report saved: ${pdfPath}`);
            }
            if (reports.length > 0) {
                (0, helpers_1.showInfo)(`Reports generated in: ${outputDir}`);
            }
        }
        catch (error) {
            spinner.fail();
            (0, helpers_1.showError)(error.message);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=analyze.js.map