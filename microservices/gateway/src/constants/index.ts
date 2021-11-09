const MS_NAME = process.env.MS_NAME || 'gateway';
const MS_CONNECTION = process.env.MS_CONNECTION || undefined;
const MS_BATCH_LIMIT = Number(process.env.MS_BATCH_LIMIT) || undefined;
const MS_DISABLE_REMOTE_MIDDLEWARE = Number(process.env.MS_DISABLE_REMOTE_MIDDLEWARE) || 0;

export { MS_NAME, MS_CONNECTION, MS_BATCH_LIMIT, MS_DISABLE_REMOTE_MIDDLEWARE };