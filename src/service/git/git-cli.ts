import LoggerService from "@bp/service/logger/logger-service";
import LoggerServiceFactory from "@bp/service/logger/logger-service-factory";
import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs";
import { LocalGit } from "@bp/service/configs/configs.types";

/**
 * Command line git commands executor service
 */
export default class GitCLIService {

  private readonly logger: LoggerService;
  private readonly auth: string | undefined;
  private readonly gitData: LocalGit;

  constructor(auth: string | undefined, gitData: LocalGit) {
    this.logger = LoggerServiceFactory.getLogger();
    this.auth  = auth;
    this.gitData = gitData;
  }

  /**
   * Return a pre-configured SimpleGit instance able to execute commands from current
   * directory or the provided one
   * @param cwd [optional] current working directory
   * @returns {SimpleGit} 
   */
  private git(cwd?: string): SimpleGit {
    const gitConfig = { ...(cwd ? { baseDir: cwd } : {})};
    return simpleGit(gitConfig).addConfig("user.name", this.gitData.user).addConfig("user.email", this.gitData.email);
  }

  /**
   * Update the provided remote URL by adding the auth token if not empty
   * @param remoteURL remote link, e.g., https://github.com/kiegroup/git-backporting-example.git
   */
  private remoteWithAuth(remoteURL: string): string {
    if (this.auth && this.gitData.user) {
      return remoteURL.replace("://", `://${this.gitData.user}:${this.auth}@`);
    }

    // return remote as it is
    return remoteURL;
  }

  /**
   * Return the git version
   * @returns {Promise<string | undefined>}
   */
  async version(cwd: string): Promise<string | undefined> {
    const rawOutput = await this.git(cwd).raw("version");
    const match = rawOutput.match(/(\d+\.\d+(\.\d+)?)/);
    return match ? match[1] : undefined;
  }

  /**
   * Clone a git repository
   * @param from url or path from which the repository should be cloned from
   * @param to location at which the repository should be cloned at
   * @param branch branch which should be cloned
   */
  async clone(from: string, to: string, branch: string): Promise<void> {
    this.logger.info(`Cloning repository ${from} to ${to}`);
    if (!fs.existsSync(to)) {
      await simpleGit().clone(this.remoteWithAuth(from), to, ["--quiet", "--shallow-submodules", "--no-tags", "--branch", branch]);
      return;
    }
    
    this.logger.info(`Folder ${to} already exist. Won't clone`);
    // checkout to the proper branch
    this.logger.info(`Checking out branch ${branch}`);
    await this.git(to).checkout(branch);
  }

  /**
   * Create a new branch starting from the current one and checkout in it
   * @param cwd repository in which createBranch should be performed
   * @param newBranch new branch name
   */
  async createLocalBranch(cwd: string, newBranch: string): Promise<void> {
    this.logger.info(`Creating branch ${newBranch}`);
    await this.git(cwd).checkoutLocalBranch(newBranch);
  }

  /**
   * Add a new remote to the current repository
   * @param cwd repository in which addRemote should be performed
   * @param remote remote git link
   * @param remoteName [optional] name of the remote, by default 'fork' is used 
   */
  async addRemote(cwd: string, remote: string, remoteName = "fork"): Promise<void> {
    this.logger.info(`Adding new remote ${remote}`);
    await this.git(cwd).addRemote(remoteName, this.remoteWithAuth(remote));
  }

  /**
   * Git fetch from a particular branch
   * @param cwd repository in which fetch should be performed
   * @param branch fetch from the given branch
   * @param remote [optional] the remote to fetch, by default origin
   */
  async fetch(cwd: string, branch: string, remote = "origin"): Promise<void> {
    this.logger.info(`Fetching ${remote} ${branch}`);
    await this.git(cwd).fetch(remote, branch, ["--quiet"]);
  }

  /**
   * Get cherry-pick a specific sha
   * @param cwd repository in which the sha should be cherry picked to
   * @param sha commit sha
   */
  async cherryPick(cwd: string, sha: string, strategy = "recursive", strategyOption = "theirs"): Promise<void> {
    this.logger.info(`Cherry picking ${sha}`);
    
    const options = ["cherry-pick", "-m", "1", `--strategy=${strategy}`, `--strategy-option=${strategyOption}`, sha];
    try {
      await this.git(cwd).raw(options);
    } catch(error) {
      const diff = await this.git(cwd).diff();
      if (diff) {
        throw new Error(`${error}\r\nShowing git diff:\r\n` + diff);
      }

      throw error;
    }
  }

  /**
   * Push a branch to a remote
   * @param cwd repository in which the push should be performed
   * @param branch branch to be pushed
   * @param remote [optional] remote to which the branch should be pushed to, by default 'origin'
   */
  async push(cwd: string, branch: string, remote = "origin", force = false): Promise<void> {
    this.logger.info(`Pushing ${branch} to ${remote}`);
    
    const options = ["--quiet"];
    if (force) {
      options.push("--force-with-lease");
    }
    await this.git(cwd).push(remote, branch, options);
  }

}