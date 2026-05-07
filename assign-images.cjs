/**
 * Конвертирует JPG/PNG → WebP и переименовывает файлы по названиям ритуалов/акций
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 88;

// ── Ритуалы: название файла → ritual_N.webp ─────────────────────────────────
const RITUAL_MAP = [
  { src: '\u201cТет-а-тет\u201d.jpg',                                  dest: 'ritual_1.webp'  },
  { src: '\u201cАромапарение\u201d.jpg',                               dest: 'ritual_2.webp'  },
  { src: '\u201cВнутренняя алхимия\u201d.jpg',                         dest: 'ritual_3.webp'  },
  { src: '\u201cTABULA RASA\u201d.jpg',                                dest: 'ritual_4.webp'  },
  { src: '\u201cТретье дыхание\u201d.jpg',                             dest: 'ritual_5.webp'  },
  { src: 'Эффект бабочки.jpg',                               dest: 'ritual_6.webp'  },
  { src: '\u201cшауча\u201d.jpg',                                      dest: 'ritual_7.webp'  },
  { src: '\u201cЛичный опыт\u201d.jpg',                                dest: 'ritual_8.webp'  },
  { src: '\u201cВолшебный чан\u201d с травами.png',                    dest: 'ritual_9.webp'  },
  { src: '\u201cВолшебный чан\u201d c морской водой и пихтой.png',     dest: 'ritual_10.webp' },
  { src: '\u201cВолшебный чан\u201d хвойный.png',                      dest: 'ritual_11.webp' },
  { src: '\u201cВолшебный чан\u201d фруктово-ягодный.png',             dest: 'ritual_12.webp' },
];

// ── Акции: название файла → sale_N.webp ─────────────────────────────────────
const SALES_MAP = [
  { src: 'Скидка на аренду домов.jpg',     dest: 'sale_1.webp' },
  { src: 'Специальное предложение.jpg',    dest: 'sale_2.webp' },
  { src: 'Счастливое утро.jpg',            dest: 'sale_3.webp' },
  { src: 'Комплексная спа-программа.jpg',  dest: 'sale_4.webp' },
  { src: 'Скидки больщим компаниям.jpg',   dest: 'sale_5.webp' },
  { src: 'Длительное бронирование.jpg',    dest: 'sale_6.webp' },
];

async function processMap(folder, map) {
  let ok = 0, skip = 0, fail = 0;
  for (const { src, dest } of map) {
    const srcPath  = path.join(folder, src);
    const destPath = path.join(folder, dest);

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
  return { ok, skip, fail };
}

async function main() {
  console.log('\n🔄 Конвертация и расстановка фото...\n');

  const ritualsDir = path.resolve('public/images/rituals');
  const salesDir   = path.resolve('public/images/sales');

  console.log('📁 РИТУАЛЫ:');
  const r = await processMap(ritualsDir, RITUAL_MAP);

  console.log('\n📁 АКЦИИ:');
  const s = await processMap(salesDir, SALES_MAP);

  const total = r.ok + s.ok;
  const skipped = r.skip + s.skip;
  const failed = r.fail + s.fail;

  console.log(`\n✅ Готово! Конвертировано: ${total}, пропущено: ${skipped}, ошибок: ${failed}`);

  if (total > 0) {
    console.log('\n📝 Обновите пути в constants (уже должны работать, если пути совпадают):');
    console.log('  rituals.ts  → /images/rituals/ritual_N.webp');
    console.log('  offers.ts   → /images/sales/sale_N.webp');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
