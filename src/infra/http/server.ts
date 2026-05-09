import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyError } from 'fastify';
import fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { uploadImageRoute } from './routes/upload-image';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error: FastifyError, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.validation,
    });
  }

  if (error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
    return reply.status(400).send({
      message: 'Body cannot be empty when content-type is application/json',
    });
  }

  console.error(error);

  return reply.status(error.statusCode ?? 500).send({
    message: error.message ?? 'Internal server error',
  });
});

server.register(fastifyCors, {
  origin: '*',
});

server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi);

server.register(uploadImageRoute);

server
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server running on port 3333');
  });
