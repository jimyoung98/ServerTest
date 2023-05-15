import express from 'express';
import { Student } from '../data/student.js';
import { Score } from '../data/score.js';

// 학생 점수 등록
export async function createScore(req, res) {
    const si_idx = req.params.si_idx;  // 포스트맨에 인덱스를 이용해 검색
    const { ss_Java, ss_Python, ss_C } = req.body; // 바디에 적은 값들을 변수로 저장

    try {
        
        const existingScore = await Score.findOne({ where: { si_idx } });// 인덱스와 일치하는 항목을 조회한다.

        if (existingScore) { //이미 값이 저장되어 있는 경우 처음에 0으로 생성할때 넣어서 있기때문
            
            const totalScore = ss_Java + ss_Python + ss_C; // 점수의 합을 구함
            const averageScore = Math.round(totalScore / 3); // 점수의 평균을 구함

            // 각필드에 입력된 값들로 업데이트를 함
            existingScore.ss_Java = ss_Java;
            existingScore.ss_Python = ss_Python;
            existingScore.ss_C = ss_C;
            existingScore.ss_total = totalScore;
            existingScore.ss_avg = averageScore;

            await existingScore.save(); // db에 저장

            res.json({ message: 'Student score updated successfully', score: existingScore });
        } else { // 없을 경우 다시 등록할때 , 삭제를 한 후 등록할 경우
            
            const totalScore = ss_Java + ss_Python + ss_C;
            const averageScore = Math.round(totalScore / 3);

            const score = await Score.create({ // 바디에서 가져온 값으로 score 테이블에 생성해준다.
                ss_Java,
                ss_Python,
                ss_C,
                ss_total: totalScore,
                ss_avg: averageScore,
                si_idx,
            });

            res.json({ message: 'Student score registered successfully', score }); // 등록을 한후 완료됐다고 말해준다.
        }
    } catch (error) {
        console.error('Error registering/updating student score:', error);
        res.status(500).json({ message: 'Failed to register/update student score' });
    }
}



// 학생 점수 수정
export async function updateScore(req, res) {
    const { si_idx } = req.params; // 포스트맨에 인덱스를 이용해 검색
    const { ss_Java, ss_Python, ss_C } = req.body; // 바디 부분의 값들을 변수에 저장

    try {
        // 점수를 수정할 Score 모델을 찾음
        const score = await Score.findOne({
            where: {
                si_idx: si_idx
            }
        });

        if (!score) { // 없다면 오류
            return res.status(404).json({ message: 'Score not found' });
        }

        // 입력된 필드만 업데이트
        if (ss_Java) {
            score.ss_Java = ss_Java;
        }
        if (ss_Python) {
            score.ss_Python = ss_Python;
        }
        if (ss_C) {
            score.ss_C = ss_C;
        }

        // 합계 계산
        score.ss_total = score.ss_Java + score.ss_Python + score.ss_C;

        // 평균 계산
        score.ss_avg = Math.round(score.ss_total / 3);

        // 점수 정보를  DB에 저장
        await score.save();

        res.json({ message: 'Student score updated successfully', score }); // 성공한 후 메세지를 보내줌
    } catch (error) {
        console.error('Error updating student score:', error);
        res.status(500).json({ message: 'Failed to update student score' });
    }
}



// 학생 점수 삭제
export async function deleteScore(req, res) {
    const { si_idx } = req.params; // 포스트맨에 인덱스를 이용해 검색

    try {
        // 점수를 삭제할 Score 모델을 찾음
        const score = await Score.findOne({
            where: {
                si_idx: si_idx
            }
        });

        if (!score) { // 없을경우 오류
            return res.status(404).json({ message: 'Score not found' });
        }

        // 점수를 삭제
        await score.destroy();

        res.json({ message: 'Student score deleted successfully' }); // 삭제한 후 메세지를 띄워줌
    } catch (error) {
        console.error('Error deleting student score:', error);
        res.status(500).json({ message: 'Failed to delete student score' });
    }
}
