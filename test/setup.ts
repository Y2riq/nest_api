import { rm } from 'fs/promises';
import { join } from 'path';

beforeEach(async () => {
  await rm(join(import.meta.dirname, '..', 'test.sqlite'), { force: true });
});
