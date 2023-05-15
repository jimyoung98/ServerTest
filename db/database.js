import { config } from '../config.js';
import SQ from 'sequelize';

const {host, user, database, password } = config.db;
// db mysql에 연결한다는 코드 시간대도 맞춰준다.
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: false,
    timezone: '+09:00'
});
