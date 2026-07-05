/** Normalise et valide un numéro sénégalais (+221) */
export function normalizeSenegalPhone(input) {
  const digits = String(input ?? '').replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('221') && digits.length === 12) {
    return `+${digits}`
  }
  if (digits.length === 9) {
    return `+221${digits}`
  }
  if (digits.startsWith('00221') && digits.length === 14) {
    return `+221${digits.slice(5)}`
  }
  return `+${digits}`
}

export function isValidSenegalPhone(input) {
  const normalized = normalizeSenegalPhone(input)
  return /^\+221(70|75|76|77|78|33)\d{7}$/.test(normalized)
}
