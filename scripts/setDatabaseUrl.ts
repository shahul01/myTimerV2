import os from 'os';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
let dbPath;

if (os.platform() === 'win32') {
  dbPath = process.env.DATABASE_URL_WINDOWS
} else if (os.platform() === 'darwin') {
  dbPath = process.env.DATABASE_URL_MACOS;
} else {
  throw new Error('Unsupported OS');
};

try {
  const prismaEnvFilePath = path.join(__dirname, '../', 'prisma', '.env');
  const prismaDir = path.dirname(prismaEnvFilePath);
  if (!fs.existsSync( prismaDir )) fs.mkdirSync(prismaDir);

  fs.writeFileSync(prismaEnvFilePath, `DATABASE_URL='${dbPath}'`);

  console.log(`Updated prisma/.env file properly`);

} catch (err) {
  console.error(`Error updating .env file: `, err);
  process.exit(1);
};
