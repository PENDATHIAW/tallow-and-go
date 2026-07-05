/**
 * Mapping des visuels fournis (noms UUID conservés tels quels).
 * Produits → public/products/ · Pages → public/illustrations/
 */
export const productImages = {
  safaa: '/products/BA5CA76E-B226-480C-A2CD-54C01D4FF7C5.png',
  aura: '/products/CEC88E4C-1011-46F2-8306-E40A49A4E5ED.png',
  'fix-it': '/products/3D401B3A-3369-4D5E-B2B9-CD48CF4195FC.png',
  noor: '/products/2A28ED79-D383-4AB9-881B-5CF109F8C86F.png',
  sunsafe: '/products/0F94690B-6A6D-499D-89B6-04A465D7A753.png',
  nurture: '/products/BDB3D764-9390-4639-A717-166C8A2E4F49.png',
  shiny: '/products/32C60D3F-8CFA-44FC-8AF8-717FD0B4F871.png',
  cocoony: '/products/06C35FCC-202E-4145-B055-1C5ED2BD8FFB.png',
  'relief-balm': '/products/2DA727F0-CF7A-44E4-AA72-4BD0336C1562.png',
  'relief-dry-oil': '/products/6C0540B9-01EE-436F-9ADB-ADA4D8062C34.png',
  clean: '/products/C63C5BC2-F11D-441F-9C2D-F9CAE851128B.png',
  'soft-kiss': '/products/25B04CED-53B0-4A69-A381-96B426E01A81.png',
  comfy: '/products/D5E3B4A7-DE68-486A-ADC0-56AA2392A63C.png',
  'glow-and-go': '/products/54F8B2D4-A4BF-4C7D-AAAA-7BFC4AFE06B2.png',
}

export const bundleImages = {
  'mama-bear': '/illustrations/44A8C9DC-D57F-4204-8B6B-959D6857A7DC.png',
  'eden-kit': '/illustrations/12C8803B-FC63-4BF5-8796-7E8B78CB0DFE.png',
}

export const pageImages = {
  'universe-visage': '/illustrations/769DB330-E9EB-4D00-B722-A80A3BD4EFD1.png',
  'universe-corps': '/illustrations/891CE9E4-E556-4516-9074-C6353EBEC7A8.png',
  'universe-essentiels': '/illustrations/D117DE0D-7B27-4ABC-8178-507B5816373F.png',
  'universe-nomades': '/illustrations/5558FE25-7987-4293-A15D-CAA09E706ABA.png',
  'routines-hero': '/illustrations/E08721D2-7427-47CD-9595-046FF72BCB33.png',
  'coffrets-hero': '/illustrations/44A8C9DC-D57F-4204-8B6B-959D6857A7DC.png',
  'home-why': '/illustrations/5EF0FFEB-F27A-4248-B35F-CE0009351D50.png',
}

export function getProductImage(productId) {
  return productImages[productId] ?? null
}

export function getPageImage(pageKey) {
  return pageImages[pageKey] ?? null
}

export function getBundleImage(bundleId) {
  return bundleImages[bundleId] ?? null
}
