import fs from 'fs';
import path from 'path';

// Считываем аргумент, полученный из команды npm run migrate:generate
const name = process.argv[2];
if (!name) {
  // Если имя не передано - кидаем ошибку
  throw Error('Migration name must be provided as a first argument: "npm run migrate:generate <name>"');
}

const src = path.resolve(__dirname, 'template.txt');
const dst = path.resolve(__dirname, 'migrations', `${Date.now()}-${name}.ts`);

// Копируем файл template.txt в файл с именем текущее время + название
fs.copyFileSync(src, dst);

console.log('Successfully generated new migration:', dst);
