/**
 * Генерация размеров иконок PWA из базового файла.
 * Запуск: node scripts/generate-icons.js
 */
const sharp = require("sharp");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "icons");
const src = path.join(dir, "icon-512.png");

(async () => {
  const meta = await sharp(src).metadata();
  console.log("source:", meta.width + "x" + meta.height);

  await sharp(src).resize(192, 192).png().toFile(path.join(dir, "icon-192.png"));
  console.log("icon-192.png");

  // нормализуем базовый файл к 512x512 через временный файл
  const tmp = path.join(dir, "_icon-512-tmp.png");
  await sharp(src).resize(512, 512).png().toFile(tmp);
  await require("fs").promises.rename(tmp, path.join(dir, "icon-512.png"));
  console.log("icon-512.png (нормализован)");

  // maskable: контент в безопасной зоне (80%), фон — цвет приложения
  await sharp(src)
    .resize(410, 410)
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#F5F2EA" })
    .png()
    .toFile(path.join(dir, "maskable-512.png"));
  console.log("maskable-512.png");

  console.log("Готово.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
