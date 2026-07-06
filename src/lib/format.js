export function formatPrice(amount) {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} F`
}

/** Prix d'entrée affiché : minimum des produits mis en avant, sinon minimum du catalogue actif. */
export function getLowestDisplayPrice(products) {
  if (!products?.length) return null
  const featured = products.filter((p) => p.featured)
  const pool = featured.length ? featured : products
  return Math.min(...pool.map((p) => p.price))
}
