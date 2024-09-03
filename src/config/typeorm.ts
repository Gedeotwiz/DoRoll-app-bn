import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';


dotenv.config();

ConfigModule.forRoot(); 
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT'), 10) || 5432,
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: ['src/migrations/**/*.ts'],
});
