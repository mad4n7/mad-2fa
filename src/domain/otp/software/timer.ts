import { SECONDS_TO_REFRESH } from './constants/encryption'

export const timer = (
  secondsToRefresh: number = SECONDS_TO_REFRESH,
  updateOneTimePassword: Function
): number => {
  const unixEpoch = Math.round(new Date().getTime() / 1000.0)
  const countDown = secondsToRefresh - (unixEpoch % secondsToRefresh)
  if (unixEpoch % secondsToRefresh === 0) {
    updateOneTimePassword()
  }

  return countDown
}
