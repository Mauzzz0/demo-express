export const loginComponent = {
  type: 'object',
  properties: {
    nick: {
      type: 'string',
      format: 'string',
      example: 'nick',
    },
    password: {
      type: 'string',
      format: 'string',
      example: 'password',
    },
  },
};
