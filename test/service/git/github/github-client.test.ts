import GitClientFactory from "@bp/service/git/git-client-factory.js";
import { GitPullRequest, GitClientType } from "@bp/service/git/git.types.js";
import GitHubClient from "@bp/service/git/github/github-client.js";
import { MERGED_PR_FIXTURE, REPO, TARGET_OWNER } from "../../../support/mock/github-data.js";
import { mockGitHubClient } from "../../../support/mock/git-client-mock-support.js";

describe("github service", () => {

  let gitClient: GitHubClient;

  beforeAll(() => {
    // init git service
    GitClientFactory.reset();
    GitClientFactory.getOrCreate(GitClientType.GITHUB, "whatever", "http://localhost/api/v3");
  });

  beforeEach(() => {
    // mock github api calls
    mockGitHubClient("http://localhost/api/v3");

    gitClient = GitClientFactory.getClient() as GitHubClient;
  });

  test("get pull request: success", async () => {
    const res: GitPullRequest = await gitClient.getPullRequest(TARGET_OWNER, REPO, MERGED_PR_FIXTURE.number, true);
    expect(res.sourceRepo).toEqual({
      owner: "fork",
      project: "reponame",
      cloneUrl: "https://github.com/fork/reponame.git"
    });
    expect(res.targetRepo).toEqual({
      owner: "owner",
      project: "reponame",
      cloneUrl: "https://github.com/owner/reponame.git"
    });
    expect(res.title).toBe("PR Title");
    expect(res.commits!.length).toBe(1);
    expect(res.commits).toEqual(["28f63db774185f4ec4b57cd9aaeb12dbfb4c9ecc"]);
  });

});