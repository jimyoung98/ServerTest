import SQ, { Sequelize } from 'sequelize';
import { sequelize } from '../db/database.js';
import {Student} from './student.js'

const DataTypes = SQ.DataTypes;
// sequelize를 이용해 테이블을 만든다
export const Score = sequelize.define(
    'student_score', // table name
    {
        ss_idx: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ss_Java: {
            type: DataTypes.INTEGER,
            
        },
        ss_Python: {
            type: DataTypes.INTEGER,
            
        },
        ss_C: {
            type: DataTypes.INTEGER,
            
        },
        ss_regdate: {
            type: DataTypes.DATE(),
            defaultValue: DataTypes.NOW(),
            
        },
        ss_total: {
            type: DataTypes.INTEGER,

        },
        ss_avg: {
            type: DataTypes.INTEGER,
        },
        si_idx: {
            type: DataTypes.INTEGER,
            references: {
                model: Student,
                key: 'si_idx',
            },
            onUpdate: 'cascade', // 업데이트나 딜리트를 할 때 같이 수정되거나 삭제될 일이 있을경우 포린키로 연결된 부분을 삭제나 수정 해준다.
            onDelete: 'cascade',
        },
    },
    {
        timestamps: false, // 현재 시간만 받아오기때문에 false
        freezeTableName: true // 테이블명에 s 를 안들어가게 해주는 코드
    }

)
Student.hasOne(Score, { foreignKey: 'si_idx', as: 'score' }); // 두 테이블이 일대일 관계를 가지고 외래키로 인덱스값을 사용한다는 뜻
Score.belongsTo(Student, { // 두 테이블이 일대일 관계를 가지고 외래키로 인덱스값을 사용한다는 뜻 , 두 설정은 각 모델 인스턴스에서 다른 모델 인스턴스에 접근 가능하게 함
    foreignKey: 'si_idx',
    as: 'student',
});
