import { GitHubRepo, RepoStats, CommitInfo } from '../types';
export declare class GitHubService {
    private client;
    constructor(token?: string);
    getRepository(owner: string, repo: string): Promise<GitHubRepo>;
    getCommitCount(owner: string, repo: string): Promise<number>;
    getContributors(owner: string, repo: string): Promise<number>;
    getLanguages(owner: string, repo: string): Promise<Record<string, number>>;
    getRecentCommits(owner: string, repo: string, count?: number): Promise<CommitInfo[]>;
    analyzeRepository(owner: string, repo: string): Promise<RepoStats>;
}
//# sourceMappingURL=github.d.ts.map