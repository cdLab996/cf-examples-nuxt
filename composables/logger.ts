import type { ConsolaOptions } from 'consola'
import { consola } from 'consola'

export const logger = consola

/**
 * Creates or retrieves a logger instance with optional configuration and tag.
 * @param tag - Optional tag to associate with the logger instance.
 * @param options - Partial options to configure the logger instance.
 * @returns A logger instance, either with the specified tag or the default logger.
 */
export function useLogger(tag?: string, options: Partial<ConsolaOptions> = {}) {
  return tag ? logger.create(options).withTag(tag) : logger
}

/**
 * Creates a logger instance with a specified tag and the current timestamp.
 * This function is useful for creating consistent loggers with time-stamped tags.
 * @param tag - The tag to associate with the logger instance, typically indicating the context (e.g., 'server-log').
 * @returns A logger instance with the given tag and a timestamp.
 */
const createLoggerWithTimestamp = (tag: string) =>
  logger.withTag(`${tag}: ${new Date().toLocaleString()}.${new Date().getMilliseconds()}`)

/**
 * Logger specifically configured for server-side logging with a time-stamped 'server-log' tag.
 * Use this logger for all server-side logging purposes.
 */
export const serverLog = createLoggerWithTimestamp('server-log')

/**
 * Logger specifically configured for client-side logging with a time-stamped 'client-log' tag.
 * Use this logger for all client-side logging purposes.
 */
export const clientLog = createLoggerWithTimestamp('client-log')
