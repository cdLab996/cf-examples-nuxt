import { consola } from 'consola'

/**
 * Creates a logger instance with a specified tag and the current timestamp.
 * This function is useful for creating consistent loggers with time-stamped tags.
 * @param tag - The tag to associate with the logger instance, typically indicating the context (e.g., 'server-log').
 * @returns A logger instance with the given tag and a timestamp.
 */
const createLoggerWithTimestamp = (tag: string) =>
  consola.withTag(
    `${tag}: ${new Date().toLocaleString()}.${new Date().getMilliseconds()}`
  )

/**
 * Logger specifically configured for client-side logging with a time-stamped 'client-log' tag.
 * Use this logger for all client-side logging purposes.
 */
export const clientLog = createLoggerWithTimestamp('client-log')
