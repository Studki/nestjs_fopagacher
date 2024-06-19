import { ConfigFactory, ConfigObject } from '@nestjs/config';

const databaseConfig: ConfigFactory<ConfigObject> = () => ({
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'username',
    password: process.env.DB_PASSWORD || 'password',
    databaseName: process.env.DB_NAME || 'database',
  },
});

export default databaseConfig;
