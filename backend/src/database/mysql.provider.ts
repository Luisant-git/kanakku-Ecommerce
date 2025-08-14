import { Provider } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';

export const MYSQL_CONNECTION = 'MYSQL_CONNECTION';

export const mysqlProvider: Provider = {
  provide: MYSQL_CONNECTION,
  useFactory: async () => {
    return await createConnection({
      host: '108.181.201.246',
      port: 3310,
      user: 'nanouser',
      password: 'jE9FJ5W4vJx}',
      database: 'nano', // MySQL DB name
    });
  },
};
