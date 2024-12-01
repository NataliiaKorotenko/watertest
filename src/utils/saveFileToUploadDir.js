import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { UPLOADS_DIR } from '../constants/contacts.js';

export const saveFileToUploadDir = async (file) => {
  const newPath = path.join(UPLOADS_DIR, file.filename);
  await fs.rename(file.path, newPath);
};
