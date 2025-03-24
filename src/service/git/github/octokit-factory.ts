import LoggerService from "@bp/service/logger/logger-service.js";
import LoggerServiceFactory from "@bp/service/logger/logger-service-factory.js";
import { Octokit } from "@octokit/rest";

/**
 * Singleton factory class for {Octokit} instance
 */
export default class OctokitFactory {
  
  private static logger: LoggerService = LoggerServiceFactory.getLogger();
  private static octokit?: Octokit;

  public static getOctokit(token: string | undefined, apiUrl: string): Octokit {
    if (!OctokitFactory.octokit) {
      OctokitFactory.octokit = new Octokit({
        auth: token,
        userAgent: "kiegroup/git-backporting",
        baseUrl: apiUrl
      });
    }

    return OctokitFactory.octokit;
  }
}