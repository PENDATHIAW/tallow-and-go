export function formatPrice(amount) {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} F`
}
