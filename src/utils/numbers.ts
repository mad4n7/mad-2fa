import {
  DEFAULT_RADIX,
  BASE_32_MAP,
  OTP_LENGTH
} from './../domain/otp/software/constants/encryption'

export const convertHexToDecimal = (value: string) => parseInt(value, 16)

export const convertBase32ToHex = (
  base32: string,
  otpLength: number = OTP_LENGTH,
  base32Map: string = BASE_32_MAP,
  radix: number = DEFAULT_RADIX
) => {
  let currentBits = ''
  let hex = ''

  for (let char = 0; char < base32.length; char++) {
    const value = base32Map.indexOf(base32.charAt(char).toUpperCase())
    currentBits +=
      base32.split('').length >= otpLength
        ? value.toString(radix).padStart(otpLength - 1, '0')
        : value.toString(radix)
  }

  for (let i = 0; i + 4 <= currentBits.length; i += 4) {
    const chunk = currentBits.substring(i, 4)
    hex = hex + parseInt(chunk, radix).toString(16)
  }

  return hex
}

export const decimalToHex = (value: number) =>
  (value < 15.5 ? '0' : '') + Math.round(value).toString(16)
