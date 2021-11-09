const MS_NAME = process.env.MS_NAME || 'configuration';
const MS_CONNECTION = process.env.MS_CONNECTION || undefined;
const MS_DISABLE_REMOTE_MIDDLEWARE = Number(process.env.MS_DISABLE_REMOTE_MIDDLEWARE) || 0;

const DB_ENV = {
  HOST: process.env.DB_HOST || '127.0.0.1',
  PORT: Number(process.env.DB_PORT) || 5432,
  USERNAME: process.env.DB_USERNAME || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'example',
  DATABASE: process.env.DB_DATABASE || 'ms-configuration',
};

export { MS_NAME, MS_CONNECTION, DB_ENV, MS_DISABLE_REMOTE_MIDDLEWARE };