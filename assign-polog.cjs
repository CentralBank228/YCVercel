/**
 * Конвертирует PNG/JPG→WebP для полога/веников и переименовывает по ID аддона
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 88;
const SRC_FOLDER = path.resolve('public/images/venik/polog');
const DEST_FOLDER = path.resolve('public/images/venik');

// Имя файла → имя файла назначения (venik_N.webp)
// Порядок совпадает с addons.ts
const MAP = [
  // Пологи
  { src: 'Сенной полог.png',                   dest: 'venik_sennoy.webp' },
  { src: 'Пихтовый полог.jpeg',                dest: 'venik_pikhtoviy.webp' },
  { src: 'Полог разнолистный.png',             dest: 'venik_raznolistniy.webp' },
  // Услуги
  { src: 'Аромагирлянда для парной.png',       dest: 'venik_aromagirlyanda.webp' },
  // Веники
  { src: 'Эвкалиптовый веник.jpeg',            dest: 'venik_evkalipt.webp' },
  { src: 'Березовый веник.jpeg',               dest: 'venik_bereza.webp' },
  { src: 'Дубовый веник.jpeg',                 dest: 'venik_dub.webp' },
  { src: 'Липовый веник.jpg',                  dest: 'venik_lipa.webp' },
  { src: 'Веник из канадского дуба.jpeg',      dest: 'venik_kanadsky_dub.webp' },
  { src: 'Пихтовый веник.jpeg',                dest: 'venik_pikhta.webp' },
  // Сертификат
  { src: 'подарочный сертификат.jpg',          dest: 'venik_sertifikat.webp' },
];

async function main() {
  console.log('\n🔄 Конвертация polog PNG/JPG → WebP...\n');
  let ok = 0, skip = 0, fail = 0;

  for (const { src, dest } of MAP) {
    const srcPath  = path.join(SRC_FOLDER, src);
    const destPath = path.join(DEST_FOLDER, dest);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ⚠ Не найден: ${src}`);
      skip++;
      continue;
    }

    try {
      const origSize = fs.statSync(srcPath).size;
      const info = await sharp(srcPath)
        .resize({ width: 1200, withoutEnlargement: true }) // ограничим огромные PNG
        .webp({ quality: QUALITY })
        .toFile(destPath);
      const saving = ((1 - info.size / origSize) * 100).toFixed(1);
      console.log(`  ✓ ${src}\n    → ${dest}  (${(origSize/1024).toFixed(0)} KB → ${(info.size/1024).toFixed(0)} KB, -${saving}%)`);
      ok++;
    } catch (err) {
      console.error(`  ✗ Ошибка [${src}]: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n✅ Готово! Конвертировано: ${ok}, пропущено: ${skip}, ошибок: ${fail}`);
}

main().catch(e => { console.error(e); process.exit(1); });
