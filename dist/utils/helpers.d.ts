import { RepoStats } from '../types';
export declare function parseRepositoryUrl(input: string): {
    owner: string;
    repo: string;
} | null;
export declare function formatStats(stats: RepoStats): void;
export declare function showError(message: string): void;
export declare function showSuccess(message: string): void;
export declare function showInfo(message: string): void;
//# sourceMappingURL=helpers.d.ts.map