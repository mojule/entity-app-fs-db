import * as promiseRetry from 'async-await-retry'

export const retry = <T>( fn: () => Promise<T> ): Promise<T> =>
  promiseRetry(
    fn,
    null,
    { retriesMax: 3, interval: 50, exponential: true, factor: 2 }
  )
