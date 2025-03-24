import { Args } from "@bp/service/args/args.types.js";
import { Configs } from "@bp/service/configs/configs.types.js";
import LoggerService from "@bp/service/logger/logger-service.js";
import LoggerServiceFactory from "@bp/service/logger/logger-service-factory.js";

/**
 * Abstract configuration parser class in charge to parse 
 * Args and produces a common Configs object
 */
 export default abstract class ConfigsParser {
  
  protected readonly logger: LoggerService;

  constructor() {
    this.logger = LoggerServiceFactory.getLogger();
  }

  abstract parse(args: Args): Promise<Configs>;

  async parseAndValidate(args: Args): Promise<Configs> {
    const configs: Configs = await this.parse(args);

    // apply validation, throw errors if something is wrong
    
    // if pr is opened check if the there exists one single commit
    if (configs.originalPullRequest.state == "open") {
      this.logger.warn("Trying to backport an open pull request");
    }

    // if PR is closed and not merged throw an error
    if (configs.originalPullRequest.state == "closed" && !configs.originalPullRequest.merged) {
      throw new Error("Provided pull request is closed and not merged");
    }

    return Promise.resolve(configs);
  }
}