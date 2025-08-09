import axios, { AxiosInstance } from 'axios';
import { GitHubRepo, RepoStats, CommitInfo } from '../types';

export class GitHubService {
    private client: AxiosInstance;

    constructor(token?: string) {
        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitHub-Insights-CLI',
                ...(token && { 'Authorization': `token ${token}` })
            },
            timeout: 10000 // 10 second timeout
        });

        // Add response interceptor for better error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 403) {
                    const resetTime = error.response.headers['x-ratelimit-reset'];
                    const resetDate = resetTime ? new Date(resetTime * 1000).toLocaleTimeString() : 'unknown';
                    throw new Error(`GitHub API rate limit exceeded. Rate limit resets at ${resetDate}. Consider using a GitHub token with -t option.`);
                }
                if (error.response?.status === 401) {
                    throw new Error('GitHub API authentication failed. Check your token.');
                }
                throw error;
            }
        );
    }

    async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
        try {
            const response = await this.client.get<GitHubRepo>(`/repos/${owner}/${repo}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error(`Repository ${owner}/${repo} not found`);
            }
            throw new Error(`Failed to fetch repository: ${error.message}`);
        }
    }

    async getCommitCount(owner: string, repo: string): Promise<number> {
        try {
            // Get the default branch first
            const repoData = await this.getRepository(owner, repo);
            const response = await this.client.get(
                `/repos/${owner}/${repo}/commits?sha=${repoData.default_branch}&per_page=1`
            );

            const linkHeader = response.headers.link;
            if (linkHeader && linkHeader.includes('rel="last"')) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                return match ? parseInt(match[1]) : 1;
            }

            return response.data.length;
        } catch (error: any) {
            console.warn(`Could not fetch commit count: ${error.message}`);
            return 0;
        }
    }

    async getContributors(owner: string, repo: string): Promise<number> {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/contributors?per_page=1`);
            const linkHeader = response.headers.link;

            if (linkHeader && linkHeader.includes('rel="last"')) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                return match ? parseInt(match[1]) : response.data.length;
            }

            return response.data.length;
        } catch (error: any) {
            console.warn(`Could not fetch contributors: ${error.message}`);
            return 0;
        }
    }

    async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/languages`);
            return response.data;
        } catch (error: any) {
            console.warn(`Could not fetch languages: ${error.message}`);
            return {};
        }
    }

    async getRecentCommits(owner: string, repo: string, count = 10): Promise<CommitInfo[]> {
        try {
            const response = await this.client.get(
                `/repos/${owner}/${repo}/commits?per_page=${count}`
            );

            return response.data.map((commit: any) => ({
                sha: commit.sha.substring(0, 7),
                message: commit.commit.message.split('\n')[0],
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url
            }));
        } catch (error: any) {
            console.warn(`Could not fetch recent commits: ${error.message}`);
            return [];
        }
    }

    async analyzeRepository(owner: string, repo: string): Promise<RepoStats> {
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