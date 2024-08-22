import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/User/user.entity';
import { Task } from 'src/task/task.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [User, Task],
    synchronize: false, 
    migrations: ['src/migrations/**/*.ts'],
});
