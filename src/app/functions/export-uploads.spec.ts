import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { exportUploads } from '@/app/functions/export-uploads';
import { isRight, unwrapEither } from '@/shared/either';
import { makeUpload } from '@/test/factories/make-upload';

vi.mock('@/infra/storage/upload-file-to-storage', () => {
  return {
    uploadFileToStorage: vi.fn().mockImplementation(() => {
      const key = `downloads/${randomUUID()}.csv`;

      return {
        key,
        url: `https://storage.com/${key}`,
      };
    }),
  };
});

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID();

    await makeUpload({ name: `${namePattern}.wep` });
    await makeUpload({ name: `${namePattern}.wep` });
    await makeUpload({ name: `${namePattern}.wep` });
    await makeUpload({ name: `${namePattern}.wep` });
    await makeUpload({ name: `${namePattern}.wep` });

    const sut = await exportUploads({
      searchQuery: namePattern,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).reportUrl).toEqual(
      expect.stringContaining('https://storage.com/downloads/')
    );
  });
});
