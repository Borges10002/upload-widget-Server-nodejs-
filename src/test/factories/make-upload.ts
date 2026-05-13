import { fakerPT_BR as faker } from '@faker-js/faker';
import type { InferInsertModel } from 'drizzle-orm';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

export async function makeUpload(
  overrides?: Partial<InferInsertModel<typeof schema.uploads>>
) {
  const fileName = faker.system.fileName();

  const result = await db
    .insert(schema.uploads)
    .values({
      name: fileName,
      remoteKey: `images/${fileName}`,
      remoteUrl: `http://example.com/images/${fileName}`,
      ...overrides,
    })
    .returning();

  const upload = result[0];

  if (!upload) {
    throw new Error('Upload was not created');
  }

  return upload;
}
