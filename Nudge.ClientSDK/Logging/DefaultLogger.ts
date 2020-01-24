import registry from "~/Util/registry";

/*
 * Helpers to make it easier to import logger functions
*/
export const error = (...args: any) => registry.logger.error(...args);
export const warning = (...args: any) => registry.logger.warning(...args);
export const info = (...args: any) => registry.logger.info(...args);
export const debug = (...args: any) => registry.logger.debug(...args);

