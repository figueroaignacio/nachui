import { Injectable } from '@nestjs/common';

const API = 'https://api.github.com';

export class GithubError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export type GithubUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
};

export type GithubRepo = {
  fullName: string;
  defaultBranch: string;
  private: boolean;
};

export type TreeFile = { path: string; content: string };

const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const BRANCH = /^[A-Za-z0-9._/-]+$/;

export function isRepoName(value: string): boolean {
  return REPO.test(value) && !value.includes('..');
}

export function isBranchName(value: string): boolean {
  return (
    BRANCH.test(value) && !value.includes('..') && !value.startsWith('/') && !value.endsWith('/')
  );
}

/** The few GitHub endpoints the Studio needs, over plain fetch. */
@Injectable()
export class GithubClient {
  private async request<T>(
    token: string | null,
    path: string,
    init: { method?: string; body?: unknown } = {},
  ): Promise<T> {
    const response = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'nachui-studio',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    if (!response.ok) {
      let message = response.statusText;
      try {
        const data = (await response.json()) as { message?: string };
        if (data.message) message = data.message;
      } catch {
        message = response.statusText;
      }
      throw new GithubError(response.status, message);
    }

    return (await response.json()) as T;
  }

  async exchangeCode(options: {
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: options.clientId,
        client_secret: options.clientSecret,
        code: options.code,
        redirect_uri: options.redirectUri,
      }),
    });
    const data = (await response.json()) as { access_token?: string; error_description?: string };
    if (!response.ok || !data.access_token) {
      throw new GithubError(401, data.error_description ?? 'GitHub did not return a token.');
    }
    return data.access_token;
  }

  getUser(token: string): Promise<GithubUser> {
    return this.request<GithubUser>(token, '/user');
  }

  async listRepos(token: string): Promise<GithubRepo[]> {
    const repos = await this.request<
      Array<{
        full_name: string;
        default_branch: string;
        private: boolean;
        permissions?: { push?: boolean };
      }>
    >(token, '/user/repos?per_page=100&sort=pushed');
    return repos
      .filter((repo) => repo.permissions?.push !== false)
      .map((repo) => ({
        fullName: repo.full_name,
        defaultBranch: repo.default_branch,
        private: repo.private,
      }));
  }

  async fileExists(token: string, repo: string, path: string, ref: string): Promise<boolean> {
    try {
      await this.request(
        token,
        `/repos/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`,
      );
      return true;
    } catch (error) {
      if (error instanceof GithubError && error.status === 404) return false;
      throw error;
    }
  }

  /** Branch from `base`, commit every file in one tree and open the pull request. */
  async openPullRequest(
    token: string,
    options: {
      repo: string;
      base: string;
      branch: string;
      title: string;
      body: string;
      files: TreeFile[];
    },
  ): Promise<{ url: string; branch: string }> {
    const { repo } = options;
    const ref = await this.request<{ object: { sha: string } }>(
      token,
      `/repos/${repo}/git/ref/heads/${encodeURI(options.base)}`,
    );
    const baseSha = ref.object.sha;
    const commit = await this.request<{ tree: { sha: string } }>(
      token,
      `/repos/${repo}/git/commits/${baseSha}`,
    );
    const tree = await this.request<{ sha: string }>(token, `/repos/${repo}/git/trees`, {
      method: 'POST',
      body: {
        base_tree: commit.tree.sha,
        tree: options.files.map((file) => ({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content,
        })),
      },
    });
    const created = await this.request<{ sha: string }>(token, `/repos/${repo}/git/commits`, {
      method: 'POST',
      body: { message: options.title, tree: tree.sha, parents: [baseSha] },
    });

    let branch = options.branch;
    for (let attempt = 0; ; attempt++) {
      try {
        await this.request(token, `/repos/${repo}/git/refs`, {
          method: 'POST',
          body: { ref: `refs/heads/${branch}`, sha: created.sha },
        });
        break;
      } catch (error) {
        if (!(error instanceof GithubError) || error.status !== 422 || attempt >= 4) throw error;
        branch = `${options.branch}-${attempt + 2}`;
      }
    }

    const pull = await this.request<{ html_url: string }>(token, `/repos/${repo}/pulls`, {
      method: 'POST',
      body: { title: options.title, head: branch, base: options.base, body: options.body },
    });
    return { url: pull.html_url, branch };
  }
}
