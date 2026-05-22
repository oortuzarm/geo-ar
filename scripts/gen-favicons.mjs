// Favicon generator — extracts embedded PNG from isotipo.svg and generates all favicon sizes
import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require   = createRequire(import.meta.url)
const { PNG }   = require('../node_modules/pngjs/lib/png.js')

// ── 1. Extract base64 PNG from SVG ──────────────────────────────────────────
const svgText   = readFileSync(join(__dirname, '../public/isotipo.svg'), 'utf8')
const match     = svgText.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)
if (!match) { console.error('No embedded PNG found in isotipo.svg'); process.exit(1) }

const srcBuffer = Buffer.from(match[1], 'base64')

// ── 2. Decode source PNG ─────────────────────────────────────────────────────
function decodePng(buffer) {
  return new Promise((resolve, reject) => {
    const png = new PNG()
    png.parse(buffer, (err, data) => err ? reject(err) : resolve(data))
  })
}

// ── 3. Bilinear resize ───────────────────────────────────────────────────────
function resize(src, srcW, srcH, dstW, dstH) {
  const dst  = Buffer.alloc(dstW * dstH * 4)
  const xRatio = srcW / dstW
  const yRatio = srcH / dstH

  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      const srcX = x * xRatio
      const srcY = y * yRatio
      const x0   = Math.floor(srcX)
      const y0   = Math.floor(srcY)
      const x1   = Math.min(x0 + 1, srcW - 1)
      const y1   = Math.min(y0 + 1, srcH - 1)
      const xFrac = srcX - x0
      const yFrac = srcY - y0

      const dstIdx = (y * dstW + x) * 4
      for (let c = 0; c < 4; c++) {
        const tl = src[(y0 * srcW + x0) * 4 + c]
        const tr = src[(y0 * srcW + x1) * 4 + c]
        const bl = src[(y1 * srcW + x0) * 4 + c]
        const br = src[(y1 * srcW + x1) * 4 + c]
        dst[dstIdx + c] = Math.round(
          tl * (1 - xFrac) * (1 - yFrac) +
          tr * xFrac       * (1 - yFrac) +
          bl * (1 - xFrac) * yFrac       +
          br * xFrac       * yFrac
        )
      }
    }
  }
  return dst
}

// ── 4. Encode PNG buffer ─────────────────────────────────────────────────────
function encodePng(pixels, width, height) {
  const png    = new PNG({ width, height })
  png.data     = pixels
  return PNG.sync.write(png)
}

// ── 5. Build minimal ICO (1 image: 32×32) ────────────────────────────────────
// ICO format: ICONDIR + ICONDIRENTRY + PNG data (modern ICO supports embedded PNG)
function buildIco(pngBuffer, size) {
  const ICONDIR      = Buffer.alloc(6)
  ICONDIR.writeUInt16LE(0, 0)       // reserved
  ICONDIR.writeUInt16LE(1, 2)       // type: 1 = ICO
  ICONDIR.writeUInt16LE(1, 4)       // count: 1 image

  const ICONDIRENTRY = Buffer.alloc(16)
  ICONDIRENTRY.writeUInt8(size >= 256 ? 0 : size, 0)   // width (0 = 256)
  ICONDIRENTRY.writeUInt8(size >= 256 ? 0 : size, 1)   // height
  ICONDIRENTRY.writeUInt8(0, 2)     // color count
  ICONDIRENTRY.writeUInt8(0, 3)     // reserved
  ICONDIRENTRY.writeUInt16LE(1, 4)  // color planes
  ICONDIRENTRY.writeUInt16LE(32, 6) // bits per pixel
  ICONDIRENTRY.writeUInt32LE(pngBuffer.length, 8)  // size of image data
  ICONDIRENTRY.writeUInt32LE(6 + 16, 12)           // offset: ICONDIR(6) + ICONDIRENTRY(16)

  return Buffer.concat([ICONDIR, ICONDIRENTRY, pngBuffer])
}

// ── Main ─────────────────────────────────────────────────────────────────────
const src = await decodePng(srcBuffer)
console.log(`Source PNG: ${src.width}×${src.height}`)

const sizes = [
  { name: 'favicon-16x16.png',    w: 16,  h: 16  },
  { name: 'favicon-32x32.png',    w: 32,  h: 32  },
  { name: 'apple-touch-icon.png', w: 180, h: 180 },
]

for (const { name, w, h } of sizes) {
  const pixels = resize(src.data, src.width, src.height, w, h)
  const buf    = encodePng(pixels, w, h)
  writeFileSync(join(__dirname, '../public', name), buf)
  console.log(`✓ ${name} (${w}×${h})`)
}

// favicon.ico — embed 32×32 PNG
const png32px  = resize(src.data, src.width, src.height, 32, 32)
const png32buf = encodePng(png32px, 32, 32)
writeFileSync(join(__dirname, '../public/favicon.ico'), buildIco(png32buf, 32))
console.log('✓ favicon.ico (32×32 embedded PNG)')

// favicon.svg — copy isotipo.svg directly
import { copyFileSync } from 'fs'
copyFileSync(
  join(__dirname, '../public/isotipo.svg'),
  join(__dirname, '../public/favicon.svg')
)
console.log('✓ favicon.svg (copied from isotipo.svg)')

console.log('\nAll favicon files generated successfully.')
