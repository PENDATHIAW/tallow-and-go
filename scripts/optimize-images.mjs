/**
 * Génère des WebP optimisés à côté des PNG/JPG existants (noms UUID conservés).
 * Usage: node scripts/optimize-images.mjs
 */
import { readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('public')
const DIRS = ['products', 'illustrations', 'brand', 'bundles']
const FULL_MAX = 1400
const CARD_MAX = 520
const WEBP_QUALITY = 82

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)))
    } else if (/\.(png|jpe?g)$/i.test(entry.name) && !/-sm\.webp$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath)
  const base = filePath.slice(0, -ext.length)
  const webpPath = `${base}.webp`
  const cardPath = `${base}-sm.webp`

  const sourceStat = await stat(filePath)
  if (existsSync(webpPath) && existsSync(cardPath)) {
    const webpStat = await stat(webpPath)
    const cardStat = await stat(cardPath)
    if (webpStat.mtimeMs >= sourceStat.mtimeMs && cardStat.mtimeMs >= sourceStat.mtimeMs) {
      return {
        filePath,
        before: sourceStat.size,
        afterWebp: webpStat.size,
        afterCard: cardStat.size,
        skipped: true,
      }
    }
  }

  const input = sharp(filePath).rotate()
  const meta = await input.metadata()
  const needsResize = (meta.width ?? 0) > FULL_MAX

  let pipeline = sharp(filePath).rotate()
  if (needsResize) {
    pipeline = pipeline.resize({ width: FULL_MAX, withoutEnlargement: true })
  }

  await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath)

  await sharp(filePath)
    .rotate()
    .resize({ width: CARD_MAX, withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(cardPath)

  const before = (await stat(filePath)).size
  const afterWebp = (await stat(webpPath)).size
  const afterCard = (await stat(cardPath)).size

  return { filePath, before, afterWebp, afterCard }
}

async function main() {
  let totalBefore = 0
  let totalWebp = 0
  let count = 0

  for (const dir of DIRS) {
    const abs = path.join(ROOT, dir)
    try {
      await stat(abs)
    } catch {
      continue
    }

    const files = await collectFiles(abs)
    for (const file of files) {
      if (file.endsWith('.webp')) continue
      try {
        const result = await optimizeFile(file)
        totalBefore += result.before
        totalWebp += result.afterWebp + result.afterCard
        count += 1
        console.log(
          `✓ ${path.relative(ROOT, file)} → webp ${Math.round(result.afterWebp / 1024)}KB, card ${Math.round(result.afterCard / 1024)}KB`,
        )
      } catch (err) {
        console.warn(`⚠ skipped ${path.relative(ROOT, file)}: ${err.message}`)
      }
    }
  }

  console.log(`\nOptimized ${count} images. Full PNG total ~${Math.round(totalBefore / 1024 / 1024)}MB → WebP ~${Math.round(totalWebp / 1024 / 1024)}MB`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
