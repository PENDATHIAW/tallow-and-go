import { bundleImages, getBundleImage, getPageImage, getProductImage, pageImages } from './illustrationManifest'

/** @deprecated Utiliser illustrationManifest.js — conservé pour compatibilité */
export const illustrations = {
  universes: {
    skin: pageImages['universe-visage'],
    body: pageImages['universe-corps'],
    essentials: pageImages['universe-essentiels'],
    nomades: pageImages['universe-nomades'],
  },
  pages: {
    routines: pageImages['routines-hero'],
    bundles: pageImages['coffrets-hero'],
    homeWhy: pageImages['home-why'],
  },
}

export function productIllustration(productId) {
  return getProductImage(productId)
}

export function bundleIllustration(bundleId) {
  return bundleImages[bundleId]
}

export { getPageImage, getProductImage, getBundleImage }
