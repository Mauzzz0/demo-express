import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';
import { readFileSync } from 'fs';

export const setupSwagger = (server: Express) => {
  let file = readFileSync('./src/swagger/swagger.yml', 'utf8');
  file = file.replace('$VERSION', process.env.npm_package_version ?? '1');

  const swaggerDocument = parse(file);

  // Workaround для добавления дефолтного пустого ответа
  for (const pathName in swaggerDocument.paths) {
    const path = swaggerDocument.paths[pathName];

    for (const method in path) {
      const responses = path[method].responses ?? {};

      if (!('200' in responses)) {
        responses['200'] = { description: '' };
      }

      path[method].responses = responses;
    }
  }

  server.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
