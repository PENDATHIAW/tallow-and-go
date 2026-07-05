import { getAllLocalities } from '../data/localities'

export function getShippingFeeRange() {
  const fees = getAllLocalities().map((l) => l.shippingFee)
  return {
    min: Math.min(...fees),
    max: Math.max(...fees),
  }
}
