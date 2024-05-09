import { tokenComponent } from './components/tokenComponent';
import { loginComponent } from './components/loginComponent';

export const swaggerDocument = {
  swagger: '2.0',
  info: {
    title: 'Task API',
    version: process.env.npm_package_version,
    description: 'Описание моего API',
  },
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  paths: {
    '/user/signup': {
      post: {
        summary: 'Регистрация',
        operationId: 'UserSignup',
        tags: ['User'],
        responses: {},
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/components/loginComponent' },
          },
        ],
      },
    },
    '/user/login': {
      post: {
        summary: 'Вход',
        operationId: 'UserLogin',
        tags: ['User'],
        responses: {},
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/components/loginComponent' },
          },
        ],
      },
    },
    '/user/refresh': {
      post: {
        summary: 'Обновление токенов',
        operationId: 'UserRefresh',
        tags: ['User'],
        responses: {},
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/components/tokenComponent' },
          },
        ],
      },
    },
    '/user/logout': {
      post: {
        summary: 'Удаление refresh токена',
        operationId: 'UserLogout',
        tags: ['User'],
        responses: {},
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: { $ref: '#/components/tokenComponent' },
          },
        ],
      },
    },
    '/user/profile': {
      get: {
        summary: 'Профиль',
        operationId: 'UserProfile',
        responses: {},
        tags: ['User'],
        security: [{ bearerAuth: [] }],
      },
    },
  },
  components: {
    loginComponent,
    tokenComponent,
  },
};
