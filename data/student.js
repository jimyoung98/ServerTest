import SQ from 'sequelize';
import { sequelize } from '../db/database.js';

const DataTypes = SQ.DataTypes;
// sequelize를 이용해 테이블을 만든다
export const Student = sequelize.define(
    'student_info', // table name
    {
        si_idx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        si_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        si_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        si_hp: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        si_email: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        si_address: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        si_regdate: {
            type: DataTypes.DATE(),
            defaultValue: DataTypes.NOW(),
            allowNull: false
        },
    },
    {
        timestamps: false, // 현재 시간만 받아오기때문에 false
        freezeTableName: true // 테이블명에 s 를 안들어가게 해주는 코드
    }

);


