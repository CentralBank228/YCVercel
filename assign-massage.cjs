/**
 * Конвертирует PNG → WebP для массажей и переименовывает по ID
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 88;
const FOLDER = path.resolve('public/images/spa/massage');

// Имя файла → massage_N.webp (порядок соответствует id в massages.ts)
const MASSAGE_MAP = [
  { src: '«МАССАЖ ЛИЦА» КЛАССИЧЕСКИЙМИОФАСЦИАЛЬНЫЙ.png',    dest: 'massage_101.webp' },
  { src: '«РЕБОЗО-МАССАЖ».png',                              dest: 'massage_102.webp' },
  { src: '«ВИБРОАКУСТИЧЕСКИЙ МАССАЖ ПОЮЩИМИ ЧАШАМИ».png',   dest: 'massage_103.webp' },
  { src: '«СЕГМЕНТАРНЫЙ ЭКСПРЕСС-МАССАЖ».png',              dest: 'massage_104.webp' },
  { src: '«МАССАЖ СПИНЫ И ШЕЙНО-ВОРОТНИКОВОЙ ЗОНЫ».png',   dest: 'massage_105.webp' },
  { src: '«ТРАДИЦИОННЫЙ МАССАЖ».png',                        dest: 'massage_106.webp' },
  { src: '«МОДЕЛИРУЮЩИЙ МАССАЖ».png',                        dest: 'massage_107.webp' },
  { src: '«РЕЛАКСИРУЮЩИЙ СТОУН-МАССАЖ».png',                dest: 'massage_108.webp' },
  { src: '«ТАЙСКИЙ ТРАДИЦИОННЫЙ МАССАЖ».png',               dest: 'massage_109.webp' },
];

async function main() {
  console.log('\n🔄 Конвертация массажей PNG → WebP...\n');
  let ok = 0, skip = 0, fail = 0;

  for (const { src, dest } of MASSAGE_MAP) {
    const srcPath  = path.join(FOLDER, src);
    const destPath = path.join(FOLDER, dest);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ⚠ Не найден: ${src}`);
      skip++;
      continue;
    }

    try {
      const origSize = fs.statSync(srcPath).size;
      const info = await sharp(srcPath).webp({ quality: QUALITY }).toFile(destPath);
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
