import express from 'express';
import * as studentController from '../controller/student.js'
import { body, param, validationResult } from 'express-validator';




const router = express.Router();

router.post('/', studentController.Studentcreate); // 라우터를 이용해 포스트맨에서 받아오는 주소값과, studentController 이용하여 그안의 함수 Studentcreate 사용해 정보를 등록한다. {{base}}/student/

router.delete('/:si_idx',studentController.StudentDelete) // 라우터를 이용해 포스트맨에서 받아오는 주소값과, studentController 이용하여 그안의 함수 StudentDelete 사용해 정보를 삭제한다. {{base}}/student/si_idx

router.put('/:si_idx',studentController.StudentUpdate) // 라우터를 이용해 포스트맨에서 받아오는 주소값과, studentController 이용하여 그안의 함수 Studentcreate 사용해 정보를 수정한다. {{base}}/student/si_idx

router.get('/', studentController.getStudentInfo) // 라우터를 이용해 포스트맨에서 받아오는 주소값과, studentController 이용하여 그안의 함수 getStudentInfo 사용해 정보를 조회한다. {{base}}/student/

router.get('/:si_number', studentController.searchStudentByNumber) // 라우터를 이용해 포스트맨에서 받아오는 주소값과, studentController 이용하여 그안의 함수 searchStudentByNumber 사용해 학번에 맞는 정보를 조회한다. {{base}}/student/si_number



export default router;