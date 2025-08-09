import chalk from 'chalk';
import { RepoStats } from '../types';

export function parseRepositoryUrl(input: string): { owner: string; repo: string } | null {
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

export function formatStats(stats: RepoStats): void {
    const { repo } = stats;

    console.log('\n' + chalk.blue.bold('━'.repeat(60)));
    console.log(chalk.blue.bold(`📊 Repository Analysis: ${repo.full_name}`));
    console.log(chalk.blue.bold('━'.repeat(60)));

    console.log('\n' + chalk.yellow.bold('📋 Basic Information'));
    console.log(`${chalk.gray('Name:')} ${repo.name}`);
    console.log(`${chalk.gray('Description:')} ${repo.description || 'No description'}`);
    console.log(`${chalk.gray('Owner:')} ${repo.owner.login}`);
    console.log(`${chalk.gray('Language:')} ${repo.language || 'Not specified'}`);
    console.log(`${chalk.gray('Created:')} ${new Date(repo.created_at).toLocaleDateString()}`);
    console.log(`${chalk.gray('Last Updated:')} ${new Date(repo.updated_at).toLocaleDateString()}`);

    console.log('\n' + chalk.green.bold('📈 Statistics'));
    console.log(`${chalk.gray('⭐ Stars:')} ${chalk.yellow(repo.stargazers_count.toLocaleString())}`);
    console.log(`${chalk.gray('🍴 Forks:')} ${chalk.yellow(repo.forks_count.toLocaleString())}`);
    console.log(`${chalk.gray('👀 Watchers:')} ${chalk.yellow(repo.watchers_count.toLocaleString())}`);
    console.log(`${chalk.gray('📝 Commits:')} ${chalk.yellow(stats.commits.toLocaleString())}`);
    console.log(`${chalk.gray('👥 Contributors:')} ${chalk.yellow(stats.contributors.toLocaleString())}`);
    console.log(`${chalk.gray('🐛 Open Issues:')} ${chalk.yellow(repo.open_issues_count.toLocaleString())}`);
    console.log(`${chalk.gray('📦 Size:')} ${chalk.yellow((repo.size / 1024).toFixed(2))} MB`);

    // Languages
    if (Object.keys(stats.languages).length > 0) {
        console.log('\n' + chalk.cyan.bold('💻 Languages'));
        const totalBytes = Object.values(stats.languages).reduce((a, b) => a + b, 0);

        Object.entries(stats.languages)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .forEach(([language, bytes]) => {
                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                console.log(`${chalk.gray(language + ':')} ${chalk.cyan(percentage + '%')}`);
            });
    }

    // Recent commits
    if (stats.recentCommits.length > 0) {
        console.log('\n' + chalk.magenta.bold('🔄 Recent Commits'));
        stats.recentCommits.slice(0, 5).forEach(commit => {
            const date = new Date(commit.date).toLocaleDateString();
            console.log(`${chalk.gray(commit.sha)} ${commit.message}`);
            console.log(`  ${chalk.dim(`by ${commit.author} on ${date}`)}`);
        });
    }

    console.log('\n' + chalk.blue.bold('━'.repeat(60)) + '\n');
}

export function showError(message: string): void {
    console.error(chalk.red.bold('❌ Error:'), chalk.red(message));
}

export function showSuccess(message: string): void {
    console.log(chalk.green.bold('✅ Success:'), chalk.green(message));
}

export function showInfo(message: string): void {
    console.log(chalk.blue.bold('ℹ️  Info:'), chalk.blue(message));
}