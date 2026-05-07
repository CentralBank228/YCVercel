/**
 * PNG/JPG → WebP converter
 * Usage:
 *   node convert-to-webp.cjs                          — convert all PNG/JPG in public/images
 *   node convert-to-webp.cjs path/to/file.png         — convert single file
 *   node convert-to-webp.cjs path/to/folder           — convert all PNG/JPG in folder
 *   node convert-to-webp.cjs folder --quality 90      — custom quality (default 85)
 *   node convert-to-webp.cjs folder --delete          — delete originals after converting
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// --- Parse args ---
const args = process.argv.slice(2);
const targetArg = args.find(a => !a.startsWith('--')) || './public/images';
const quality = parseInt((args.find(a => a.startsWith('--quality='))?.split('=')[1]) ?? '85');
const deleteOriginals = args.includes('--delete');

const targetPath = path.resolve(targetArg);

const SUPPORTED_EXT = ['.png', '.jpg', '.jpeg'];

function isSupported(f) {
  return SUPPORTED_EXT.includes(path.extname(f).toLowerCase());
}

async function convertFile(filePath) {
  if (!isSupported(filePath)) return;
  const outPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  try {
    const info = await sharp(filePath)
      .webp({ quality })
      .toFile(outPath);
    const origSize = fs.statSync(filePath).size;
    const saving = ((1 - info.size / origSize) * 100).toFixed(1);
    console.log(`✓ ${path.basename(filePath)} → ${path.basename(outPath)}  (${(origSize/1024).toFixed(0)} KB → ${(info.size/1024).toFixed(0)} KB, -${saving}%)`);
    if (deleteOriginals) {
      fs.unlinkSync(filePath);
      console.log(`  🗑 Удалён оригинал: ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`✗ Ошибка: ${filePath}: ${err.message}`);
  }
}

async function convertDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await convertDir(full);
    } else if (entry.isFile() && isSupported(entry.name)) {
      await convertFile(full);
    }
  }
}

async function main() {
  const stat = fs.statSync(targetPath);
  console.log(`\n🔄 PNG/JPG → WebP  [quality=${quality}${deleteOriginals ? ', удалять оригиналы' : ''}]\n`);

  if (stat.isFile()) {
    await convertFile(targetPath);
  } else if (stat.isDirectory()) {
    await convertDir(targetPath);
  } else {
    console.error('Путь не найден:', targetPath);
    process.exit(1);
  }

  console.log('\n✅ Готово!');
}

main().catch(e => { console.error(e); process.exit(1); });
