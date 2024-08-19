/* eslint-disable no-console */
const { NUXT_LOG_ENABLE } = import.meta.env

function getTimestamp() {
  // const timestamp = new Date().toLocaleString();
  // const timestamp = new Date().toLocaleString() + '.' + new Date().getMilliseconds();
  return `${new Date().toLocaleString()}.${new Date().getMilliseconds()}`
}

function logWithTimestamp(message?: any, ...optionalParams: any[]) {
  if (NUXT_LOG_ENABLE === 'true')
    console.log(`[${getTimestamp()}]`, message, ...optionalParams)
}

function infoWithTimestamp(message?: any, ...optionalParams: any[]) {
  if (NUXT_LOG_ENABLE === 'true')
    console.info(`[${getTimestamp()}]`, message, ...optionalParams)
}

function warnWithTimestamp(message?: any, ...optionalParams: any[]) {
  console.warn(`[${getTimestamp()}]`, message, ...optionalParams)
}

function errorWithTimestamp(message?: any, ...optionalParams: any[]) {
  console.error(`[${getTimestamp()}]`, message, ...optionalParams)
}

const Logger = {
  log: logWithTimestamp,
  info: infoWithTimestamp,
  warn: warnWithTimestamp,
  error: errorWithTimestamp,
}

export default Logger
