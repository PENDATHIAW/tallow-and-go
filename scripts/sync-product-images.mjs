/**
 * Publie les visuels depuis public/products/inbox/ vers public/products/
 * Supprime les anciens fichiers slug (safaa.png…) et régénère media-index.json
 */
import { readdir, stat, unlink, copyFile, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('public/products')
const INBOX = path.join(ROOT, 'inbox')
const INDEX_PATH = path.join(ROOT, 'media-index.json')

const LEGACY_SLUGS = [
  'safaa', 'aura', 'fix-it', 'noor', 'sunsafe', 'nurture', 'shiny', 'cocoony',
  'relief-balm', 'relief-dry-oil', 'clean', 'soft-kiss', 'comfy', 'glow-and-go',
]

function isValidImage(name) {
  return /\.(png|jpe?g)$/i.test(name) && !/\s2\.(png|jpe?g)$/i.test(name)
}

async function listImages(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir)
  const files = []
  for (const name of entries) {
    if (!isValidImage(name)) continue
    const full = path.join(dir, name)
    const info = await stat(full)
    if (info.size < 1024) continue
    files.push({ name, full, size: info.size })
  }
  return files
}

async function removeLegacy() {
  let removed = 0
  for (const slug of LEGACY_SLUGS) {
    for (const ext of ['.png', '.webp', '-sm.webp']) {
      const file = path.join(ROOT, `${slug}${ext}`)
      if (existsSync(file)) {
        await unlink(file)
        removed += 1
      }
    }
  }
  return removed
}

async function publishInbox() {
  await mkdir(INBOX, { recursive: true })
  const inboxFiles = await listImages(INBOX)
  let published = 0
  for (const file of inboxFiles) {
    const dest = path.join(ROOT, file.name)
    await copyFile(file.full, dest)
    published += 1
  }
  return published
}

async function buildIndex() {
  const published = await listImages(ROOT)
  const inbox = await listImages(INBOX)

  const index = {
    generatedAt: new Date().toISOString(),
    published: published.map((f) => ({
      path: `/products/${f.name}`,
      name: f.name,
      size: f.size,
    })),
    inbox: inbox.map((f) => ({
      path: `/products/inbox/${f.name}`,
      name: f.name,
      size: f.size,
    })),
  }

  await writeFile(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`)
  return index
}

async function main() {
  const removed = await removeLegacy()
  const published = await publishInbox()
  const index = await buildIndex()
  console.log(`Removed ${removed} legacy slug files.`)
  console.log(`Published ${published} inbox file(s) to /products.`)
  console.log(`Media index: ${index.published.length} published, ${index.inbox.length} in inbox.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
