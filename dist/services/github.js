"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const axios_1 = __importDefault(require("axios"));
class GitHubService {
    constructor(token) {
        this.client = axios_1.default.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitHub-Insights-CLI',
                ...(token && { 'Authorization': `token ${token}` })
            }
        });
    }
    async getRepository(owner, repo) {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}`);
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                throw new Error(`Repository ${owner}/${repo} not found`);
            }
            throw new Error(`Failed to fetch repository: ${error.message}`);
        }
    }
    async getCommitCount(owner, repo) {
        try {
            // Get the default branch first
            const repoData = await this.getRepository(owner, repo);
            const response = await this.client.get(`/repos/${owner}/${repo}/commits?sha=${repoData.default_branch}&per_page=1`);
            const linkHeader = response.headers.link;
            if (linkHeader && linkHeader.includes('rel="last"')) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                return match ? parseInt(match[1]) : 1;
            }
            return response.data.length;
        }
        catch (error) {
            console.warn(`Could not fetch commit count: ${error.message}`);
            return 0;
        }
    }
    async getContributors(owner, repo) {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/contributors?per_page=1`);
            const linkHeader = response.headers.link;
            if (linkHeader && linkHeader.includes('rel="last"')) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                return match ? parseInt(match[1]) : response.data.length;
            }
            return response.data.length;
        }
        catch (error) {
            console.warn(`Could not fetch contributors: ${error.message}`);
            return 0;
        }
    }
    async getLanguages(owner, repo) {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/languages`);
            return response.data;
        }
        catch (error) {
            console.warn(`Could not fetch languages: ${error.message}`);
            return {};
        }
    }
    async getRecentCommits(owner, repo, count = 10) {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/commits?per_page=${count}`);
            return response.data.map((commit) => ({
                sha: commit.sha.substring(0, 7),
                message: commit.commit.message.split('\n')[0],
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url
            }));
        }
        catch (error) {
            console.warn(`Could not fetch recent commits: ${error.message}`);
            return [];
        }
    }
    async analyzeRepository(owner, repo) {
        const repoData = await this.getRepository(owner, repo);
        const [commits, contributors, languages, recentCommits] = await Promise.all([
            this.getCommitCount(owner, repo),
            this.getContributors(owner, repo),
            this.getLanguages(owner, repo),
            this.getRecentCommits(owner, repo)
        ]);
        return {
            repo: repoData,
            commits,
            contributors,
            languages,
            recentCommits
        };
    }
}
exports.GitHubService = GitHubService;
//# sourceMappingURL=github.js.map