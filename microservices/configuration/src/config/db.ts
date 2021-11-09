import { createConnection } from 'typeorm';
import type { ConnectionOptions } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import { DB_ENV } from '@constants/index';

const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = DB_ENV;

const connectionDbOptions: ConnectionOptions = {
  type: 'postgres',
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: ['src/models/*.ts'],
  synchronize: true,
  logging: false,
};

/**
 * 1. Create database if not exist
 * 2. Create database connection
 */
const createDbConnection = async (
  connectionOptions: ConnectionOptions,
): Promise<ReturnType<typeof createConnection>> => {
  await createDatabase({ ifNotExist: true, characterSet: 'UTF8' }, connectionOptions);

  return createConnection(connectionOptions);
};

export { createDbConnection, connectionDbOptions };