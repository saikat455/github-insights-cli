import jsPDF from 'jspdf';
import { RepoStats } from '../types';
import * as path from 'path';
import { ensureDir } from 'fs-extra';

export class PDFService {
    async generateReport(stats: RepoStats, outputPath: string): Promise<string> {
        const doc = new jsPDF();
        const { repo } = stats;

        // Ensure output directory exists
        await ensureDir(path.dirname(outputPath));

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