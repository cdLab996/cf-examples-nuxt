/* eslint-disable no-console */
const {
  public: { logEnable },
} = useRuntimeConfig()
const getTimestamp = () => {
  // const timestamp = new Date().toLocaleString();
  // const timestamp = new Date().toLocaleString() + '.' + new Date().getMilliseconds();
  return new Date().toLocaleString() + '.' + new Date().getMilliseconds()
}

const logWithTimestamp = (message?: any, ...optionalParams: any[]) => {
  if (logEnable === 'true') {
    console.log(`[${getTimestamp()}]`, message, ...optionalParams)
  }
}

const infoWithTimestamp = (message?: any, ...optionalParams: any[]) => {
  if (logEnable === 'true') {
    console.info(`[${getTimestamp()}]`, message, ...optionalParams)
  }
}

const warnWithTimestamp = (message?: any, ...optionalParams: any[]) => {
  console.warn(`[${getTimestamp()}]`, message, ...optionalParams)
}

const errorWithTimestamp = (message?: any, ...optionalParams: any[]) => {
  console.error(`[${getTimestamp()}]`, message, ...optionalParams)
}

const Logger = {
  log: logWithTimestamp,
  info: infoWithTimestamp,
  warn: warnWithTimestamp,
  error: errorWithTimestamp,
}

export default Logger
