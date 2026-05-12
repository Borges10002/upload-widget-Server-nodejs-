import { jsonSchemaTransform } from 'fastify-type-provider-zod';

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0];

type MultipartBodySchema = {
  type: 'object';
  required: string[];
  properties: Record<string, unknown>;
};

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data);

  if (schema.consumes?.includes('multipart/form-data')) {
    if (schema.body === undefined) {
      schema.body = {
        type: 'object',
        required: [],
        properties: {},
      };
    }

    const bodySchema = schema.body as MultipartBodySchema;

    bodySchema.properties.file = {
      type: 'string',
      format: 'binary',
    };

    bodySchema.required.push('file');
  }

  return { schema, url };
}
