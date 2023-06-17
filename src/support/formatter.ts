import { Brand, from, to } from "./brand"
import { Iso } from "./optics/iso"

export type Formatted = Brand<string>

export const toFormatted = to<Formatted>

export const fromFormatted = from<Formatted>

export interface Formatter extends Iso<string, Formatted> {}

/**
 * Create a formatter based on a string where the # (pound sign) symbol is a reserved character
 * to be used as a placeholder for a digit. Any other character will be left as is and will only be visible
 * if two digits are in between. Excess numbers are ignored and numbers are not allowed in the format string
 *
 * Example:
 *
 * using the format "##-##"", with "20231" returns "20-23" and "20" returns "20"
 */
export const NumberFormatter = (fmt: string): Formatter => {
  const numberLimit = fmt.match(/#/g)?.length ?? 0
  const view = (s: string) => {
    const format = fmt.split('')
    const str = s.replaceAll(/[^0-9]/g, '')
    const data = str.split('')
    let result = ''
    for (let current = 0, dataCount = 0; dataCount < data.length && current < format.length; current++) {
      if (format[current] === '#') {
        result += str[dataCount]
        dataCount++
      } else {
        result += format[current]
      }
    }
    return result as Formatted
  }
  const review = (s: Formatted) => s.replaceAll(/[^0-9]/g, '').slice(0, numberLimit)
  return Iso.make<string, Formatted>(view, review) as Formatter
}

export const WellKnownFormats = {
  creditCard: NumberFormatter('#### #### #### ####'),
  expiryDate: NumberFormatter('##/##'),
  cvc: NumberFormatter('####'),
}
