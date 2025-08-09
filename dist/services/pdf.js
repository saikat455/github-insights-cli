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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const jsPDF = require("jspdf");
const path = __importStar(require("path"));
const fs_extra_1 = require("fs-extra");
class PDFService {
    async generateReport(stats, outputPath) {
        const doc = new jsPDF();
        const { repo } = stats;
        // Ensure output directory exists
        await (0, fs_extra_1.ensureDir)(path.dirname(outputPath));
        // Title
        doc.setFontSize(20);
        doc.text('GitHub Repository Analysis', 20, 20);
        // Repository Info
        doc.setFontSize(16);
        doc.text('Repository Information', 20, 40);
        doc.setFontSize(12);
        const repoInfo = [
            `Name: ${repo.name}`,
            `Full Name: ${repo.full_name}`,
            `Description: ${repo.description || 'No description'}`,
            `Owner: ${repo.owner.login}`,
            `Language: ${repo.language || 'Not specified'}`,
            `Created: ${new Date(repo.created_at).toLocaleDateString()}`,
            `Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}`,
            `URL: ${repo.html_url}`
        ];
        let yPosition = 50;
        repoInfo.forEach(info => {
            doc.text(info, 20, yPosition);
            yPosition += 10;
        });
        // Statistics
        yPosition += 10;
        doc.setFontSize(16);
        doc.text('Statistics', 20, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        const statsInfo = [
            `⭐ Stars: ${repo.stargazers_count.toLocaleString()}`,
            `🍴 Forks: ${repo.forks_count.toLocaleString()}`,
            `👀 Watchers: ${repo.watchers_count.toLocaleString()}`,
            `📝 Commits: ${stats.commits.toLocaleString()}`,
            `👥 Contributors: ${stats.contributors.toLocaleString()}`,
            `🐛 Open Issues: ${repo.open_issues_count.toLocaleString()}`,
            `📦 Size: ${(repo.size / 1024).toFixed(2)} MB`
        ];
        statsInfo.forEach(stat => {
            doc.text(stat, 20, yPosition);
            yPosition += 10;
        });
        // Languages (if available)
        if (Object.keys(stats.languages).length > 0) {
            yPosition += 10;
            doc.setFontSize(16);
            doc.text('Languages', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            const totalBytes = Object.values(stats.languages).reduce((a, b) => a + b, 0);
            Object.entries(stats.languages)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .forEach(([language, bytes]) => {
                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                doc.text(`${language}: ${percentage}%`, 20, yPosition);
                yPosition += 10;
            });
        }
        // Recent Commits
        if (stats.recentCommits.length > 0) {
            yPosition += 10;
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            doc.setFontSize(16);
            doc.text('Recent Commits', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(10);
            stats.recentCommits.slice(0, 10).forEach(commit => {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                const date = new Date(commit.date).toLocaleDateString();
                doc.text(`${commit.sha} - ${commit.message}`, 20, yPosition);
                yPosition += 7;
                doc.text(`By ${commit.author} on ${date}`, 25, yPosition);
                yPosition += 10;
            });
        }
        // Save the PDF
        doc.save(outputPath);
        return outputPath;
    }
}
exports.PDFService = PDFService;
//# sourceMappingURL=pdf.js.map