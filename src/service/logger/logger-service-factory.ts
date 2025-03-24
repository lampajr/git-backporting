import ConsoleLoggerService from "@bp/service/logger/console-logger-service.js";
import LoggerService from "@bp/service/logger/logger-service.js";

/**
 * Singleton factory class
 */
export default class LoggerServiceFactory {

  private static instance?: LoggerService;

  public static getLogger(): LoggerService {
    if (!LoggerServiceFactory.instance) {
      LoggerServiceFactory.instance = new ConsoleLoggerService();
    }

    return LoggerServiceFactory.instance;
  }
}