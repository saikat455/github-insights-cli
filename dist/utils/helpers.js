"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRepositoryUrl = parseRepositoryUrl;
exports.formatStats = formatStats;
exports.showError = showError;
exports.showSuccess = showSuccess;
exports.showInfo = showInfo;
const chalk_1 = __importDefault(require("chalk"));
function parseRepositoryUrl(input) {
    // Handle GitHub URLs
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const urlMatch = input.match(urlPattern);
    if (urlMatch) {
        return {
            owner: urlMatch[1],
            repo: urlMatch[2].replace(/\.git$/, '')
        };
    }
    // Handle owner/repo format
    const shortPattern = /^([^\/]+)\/([^\/]+)$/;
    const shortMatch = input.match(shortPattern);
    if (shortMatch) {
        return {
            owner: shortMatch[1],
            repo: shortMatch[2]
        };
    }
    return null;
}
function formatStats(stats) {
    const { repo } = stats;
    console.log('\n' + chalk_1.default.blue.bold('━'.repeat(60)));
    console.log(chalk_1.default.blue.bold(`📊 Repository Analysis: ${repo.full_name}`));
    console.log(chalk_1.default.blue.bold('━'.repeat(60)));
    console.log('\n' + chalk_1.default.yellow.bold('📋 Basic Information'));
    console.log(`${chalk_1.default.gray('Name:')} ${repo.name}`);
    console.log(`${chalk_1.default.gray('Description:')} ${repo.description || 'No description'}`);
    console.log(`${chalk_1.default.gray('Owner:')} ${repo.owner.login}`);
    console.log(`${chalk_1.default.gray('Language:')} ${repo.language || 'Not specified'}`);
    console.log(`${chalk_1.default.gray('Created:')} ${new Date(repo.created_at).toLocaleDateString()}`);
    console.log(`${chalk_1.default.gray('Last Updated:')} ${new Date(repo.updated_at).toLocaleDateString()}`);
    console.log('\n' + chalk_1.default.green.bold('📈 Statistics'));
    console.log(`${chalk_1.default.gray('⭐ Stars:')} ${chalk_1.default.yellow(repo.stargazers_count.toLocaleString())}`);
    console.log(`${chalk_1.default.gray('🍴 Forks:')} ${chalk_1.default.yellow(repo.forks_count.toLocaleString())}`);
    console.log(`${chalk_1.default.gray('👀 Watchers:')} ${chalk_1.default.yellow(repo.watchers_count.toLocaleString())}`);
    console.log(`${chalk_1.default.gray('📝 Commits:')} ${chalk_1.default.yellow(stats.commits.toLocaleString())}`);
    console.log(`${chalk_1.default.gray('👥 Contributors:')} ${chalk_1.default.yellow(stats.contributors.toLocaleString())}`);
    console.log(`${chalk_1.default.gray('🐛 Open Issues:')} ${chalk_1.default.yellow(repo.open_issues_count.toLocaleString())}`);
    console.log(`${chalk_1.default.gray('📦 Size:')} ${chalk_1.default.yellow((repo.size / 1024).toFixed(2))} MB`);
    // Languages
    if (Object.keys(stats.languages).length > 0) {
        console.log('\n' + chalk_1.default.cyan.bold('💻 Languages'));
        const totalBytes = Object.values(stats.languages).reduce((a, b) => a + b, 0);
        Object.entries(stats.languages)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .forEach(([language, bytes]) => {
            const percentage = ((bytes / totalBytes) * 100).toFixed(1);
            console.log(`${chalk_1.default.gray(language + ':')} ${chalk_1.default.cyan(percentage + '%')}`);
        });
    }
    // Recent commits
    if (stats.recentCommits.length > 0) {
        console.log('\n' + chalk_1.default.magenta.bold('🔄 Recent Commits'));
        stats.recentCommits.slice(0, 5).forEach(commit => {
            const date = new Date(commit.date).toLocaleDateString();
            console.log(`${chalk_1.default.gray(commit.sha)} ${commit.message}`);
            console.log(`  ${chalk_1.default.dim(`by ${commit.author} on ${date}`)}`);
        });
    }
    console.log('\n' + chalk_1.default.blue.bold('━'.repeat(60)) + '\n');
}
function showError(message) {
    console.error(chalk_1.default.red.bold('❌ Error:'), chalk_1.default.red(message));
}
function showSuccess(message) {
    console.log(chalk_1.default.green.bold('✅ Success:'), chalk_1.default.green(message));
}
function showInfo(message) {
    console.log(chalk_1.default.blue.bold('ℹ️  Info:'), chalk_1.default.blue(message));
}
//# sourceMappingURL=helpers.js.map