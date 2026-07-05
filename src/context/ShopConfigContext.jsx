import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { universes } from '../data/catalog'
import {
  buildCatalog,
  buildHeroContent,
  buildHomeContent,
  fetchShopConfig,
} from '../lib/cms'
import { useLocale } from './LocaleContext'

const ShopConfigContext = createContext(null)

export function ShopConfigProvider({ children }) {
  const { locale, t } = useLocale()
  const [config, setConfig] = useState({ products: {}, bundles: {}, content: {} })
  const [ready, setReady] = useState(false)

  const load = useCallback(async () => {
    const res = await fetchShopConfig()
    if (res.ok) setConfig(res.config)
    setReady(true)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const catalog = useMemo(() => buildCatalog(config), [config])
  const homeContent = useMemo(() => buildHomeContent(config, locale), [config, locale])
  const heroContent = useMemo(() => buildHeroContent(config, locale, t.hero), [config, locale, t.hero])

  const value = useMemo(
    () => ({
      ready,
      config,
      catalog,
      homeContent,
      heroContent,
      universes,
      refresh: load,
    }),
    [ready, config, catalog, homeContent, heroContent, load],
  )

  return <ShopConfigContext.Provider value={value}>{children}</ShopConfigContext.Provider>
}

export function useShopConfig() {
  const ctx = useContext(ShopConfigContext)
  if (!ctx) {
    throw new Error('useShopConfig must be used within ShopConfigProvider')
  }
  return ctx
}
