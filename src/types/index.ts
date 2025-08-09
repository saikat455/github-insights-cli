export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    default_branch: string;
    open_issues_count: number;
    topics: string[];
    license: {
        name: string;
        spdx_id: string;
    } | null;
    owner: {
        login: string;
        avatar_url: string;
        type: string;
    };
}

export interface RepoStats {
    repo: GitHubRepo;
    commits: number;
    contributors: number;
    languages: Record<string, number>;
    recentCommits: CommitInfo[];
}

export interface CommitInfo {
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
}

export interface CLIOptions {
    output?: string;
    format?: 'json' | 'pdf' | 'both';
    token?: string;
}