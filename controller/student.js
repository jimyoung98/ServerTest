import express from 'express';
import { Student } from '../data/student.js';
import { Score } from '../data/score.js';
import Sequelize from 'sequelize';

// 학생들의 정보를 출력하는 함수
export async function getStudentInfo(req, res) {
    try {
        const students = await Student.findAll({ //모든 학생 정보 조회
            include: { // 학생의 점수 정보도 같이 조회한다.
                model: Score,
                as: 'score',
                attributes: ['ss_Java', 'ss_Python', 'ss_C', 'ss_total', 'ss_avg'],
            },
            attributes: { //랭크를 계산하기 위한 옵션을 사용하여 석차도 넣어준다.
                include: [
                    [
                        Sequelize.literal(
                            `(SELECT COUNT(*) FROM student_score AS s WHERE s.ss_avg > score.ss_avg) + 1`
                        ),
                        '석차',
                    ],
                ],
            },
            order: [ //평균을 기준으로 내림차순 정렬하고 같을경우 학번으로 내림차순 정렬
                [{ model: Score, as: 'score' }, 'ss_avg', 'DESC'],
                ['si_number', 'DESC'],
            ],
        });

        const response = {
            totalStudents: students.length, // 총학생수를 의미
            students, // 조회된 학생의 정보를 담은 배열
        };
        res.json(response); // response객체를 JSON 형식으로 응답을 보내준다.
    } catch (error) { // 오류를 처리해주는 구문
        console.error('Error retrieving student info:', error);
        res.status(500).json({ message: 'Failed to retrieve student info' });
    }
}

// 학번으로 학생 정보 조회
export async function searchStudentByNumber(req, res) {
    const { si_number } = req.params; //포스트맨에서 학번을 추출해 변수에 저장

    try {
        // 학번으로 학생을 검색합니다.
        const student = await Student.findOne({ // 주어진 학번으로 학생을 검색한다.
            where: { si_number },
            include: {// 학생의 점수 정보도 같이 조회한다.
                model: Score,
                as: 'score',
                attributes: ['ss_Java', 'ss_Python', 'ss_C','ss_total','ss_avg'],
            },
        });

        if (!student) { // 학생이 없을 경우 404 오류를 전송
            return res.status(404).json({ message: 'Student not found' });
        }

        // 결과를 정리하여 클라이언트에 응답합니다.
        const response = {
            student,
        };
        res.json(response); // response객체를 JSON 형식으로 응답을 보내준다.
    } catch (error) { // 오류를 처리해주는 구문
        console.error('Error searching student by number:', error);
        res.status(500).json({ message: 'Failed to search student by number' });
    }
}


// 학생 정보 등록
export async function Studentcreate(req, res) {
    const { si_number, si_name, si_hp, si_email, si_address } = req.body; // 포스트맨에서 받아오는걸 변수에 저장
    if (!si_number || !si_name || !si_hp || !si_email || !si_address) { // 정보를 모두 입력하지 않을경우 오류를 띄운다
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }
    try {
        const updateStudent = await Student.findOne({ where: { si_number } }); //학번으로 학생을 검색한다.

        if (updateStudent) {
            return res.status(409).json({ message: '이미 등록된 학번입니다.' });
        }

        const student = await Student.create({ si_number, si_name, si_hp, si_email, si_address }); // 학생 정보를 생성한다.

        // 학생 점수 과목 초기화
        const score = await Score.create({// 학생정보를 생성과 동시에 점수가 0인 과목을 추가
            ss_Java: 0,
            ss_Python: 0,
            ss_C: 0,
            ss_total: 0,
            ss_avg: 0,
            si_idx: student.si_idx,
        });

        res.status(201).json(student);// student JSON 형식으로 응답을 보내준다.
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};


// 학생 정보 수정
export async function StudentUpdate(req, res) {
    const { si_idx } = req.params;  // 포스트맨에서 si_idx 주소에서 받은 값을 받아온다.
    const { si_number, si_name, si_hp, si_email, si_address } = req.body; //포스트맨에서 바디의 값을 변수에 저장

    try {
        const student = await Student.findByPk(si_idx); // 입력된 값으로 학생을 찾음
        if (!student) {// 학생이 없다면 오류
            return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
        }

        // 입력된 필드만 업데이트
        if (si_number !== undefined) {
            student.si_number = si_number;
        }
        if (si_name !== undefined) {
            student.si_name = si_name;
        }
        if (si_hp !== undefined) {
            student.si_hp = si_hp;
        }
        if (si_email !== undefined) {
            student.si_email = si_email;
        }
        if (si_address !== undefined) {
            student.si_address = si_address;
        }

        await student.save(); //실제 데이터베이스에 반영하려면 save를 사용해야 한다고 한다.

        res.json({ message: '학생 정보가 수정되었습니다.' }); // 클라이언트로 수정됐다고 전달해준다.
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}






// 학생 정보 삭제

export async function StudentDelete(req, res) {
    const { si_idx } = req.params; //포스트맨의 주소에 인덱스값을 받아옴
    try {
        const student = await Student.destroy({ //인덱스값이랑 같을경우 삭제를 해준다.
            where: { si_idx: si_idx }
        });
        if (!student) { // 학생을 찾을 수 없을 경우 오류
            return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
        }
        res.json({ message: '학생 정보가 삭제되었습니다.' }); // 삭제를 한 후 클라이언트로 삭제되었다고 띄워줌
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};

