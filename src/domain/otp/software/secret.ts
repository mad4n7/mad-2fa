import JsSha from 'jssha'
import {
  DEFAULT_RADIX,
  OTP_LENGTH,
  SECONDS_TO_REFRESH
} from './constants/encryption'
import {
  convertBase32ToHex,
  convertHexToDecimal,
  decimalToHex
} from '../../../utils/numbers'
import { Settings } from './@types/settings'

const initialValues = {
  secret: '44336699',
  title: 'Example',
  domain: 'yourwebsitehere.xyz',
  issuer: 'CompanyName'
}

export const updateOneTimePassword = (settings: Settings = initialValues) => {
  const key = convertBase32ToHex(settings.secret)

  const unixEpoch = Math.round(new Date().getTime() / 1000.0)

  const time = decimalToHex(Math.floor(unixEpoch / SECONDS_TO_REFRESH))
    .toString()
    .padStart(16, '0')

  const shaObj = new JsSha('SHA-1', 'HEX')
  shaObj.setHMACKey(key, 'HEX')
  shaObj.update(time)
  const hmac = shaObj.getHMAC('HEX')

  const authString = `otpauth://totp/${settings.title}:user@${settings.domain}?secret=${settings.secret}&issuer=${settings.issuer}`

  // First 8 bytes are for the movingFactor
  const offset = convertHexToDecimal(hmac.substring(hmac.length - 1))
  const part1 = hmac.substring(0, offset * DEFAULT_RADIX)
  const part2 = hmac.substring(offset * DEFAULT_RADIX, 8)
  const part3 = hmac.substring(offset * DEFAULT_RADIX + 8, hmac.length - offset)

  const hmacParts = `${part1.length > 0 && part1}${part2}${
    part3.length > 0 && part3
  }`

  let otp =
    (convertHexToDecimal(hmac.substring(offset * 2, 8)) &
      convertHexToDecimal('7fffffff')) +
    ''
  otp = otp.substring(otp.length - OTP_LENGTH, OTP_LENGTH)

  return { otp, hmac: hmacParts, qrCode: authString }
}

// const timer = () => {
//   const unixEpoch = Math.round(new Date().getTime() / 1000.0)
//   const countDown = SECONDS_TO_REFRESH - (unixEpoch % SECONDS_TO_REFRESH)
//   if (unixEpoch % SECONDS_TO_REFRESH == 0) {
//     updateOneTimePassword()
//   }
//   document.getElementById('currentTime').innerHTML = countDown
// }

// const onLoad = () => {
//   updateOneTimePassword()
//   setInterval(timer, 1000)
// }
