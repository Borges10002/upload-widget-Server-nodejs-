import { randomUUID } from 'node:crypto';
import { describe, it } from 'vitest';
import { exportUploads } from '@/app/functions/export-uploads';
import { makeUpload } from '@/test/factories/make-upload';

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await makeUpload({ name: `${namePattern}.wep` });
    const upload2 = await makeUpload({ name: `${namePattern}.wep` });
    const upload3 = await makeUpload({ name: `${namePattern}.wep` });
    const upload4 = await makeUpload({ name: `${namePattern}.wep` });
    const upload5 = await makeUpload({ name: `${namePattern}.wep` });

    const sut = await exportUploads({
      searchQuery: namePattern,
    });
  });
});
