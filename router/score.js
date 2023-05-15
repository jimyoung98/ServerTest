import express from 'express';
import * as scoreController from '../controller/score.js'
import { body, param, validationResult } from 'express-validator';




const router = express.Router();

router.put('/:si_idx',scoreController.updateScore)  // 라우터를 이용해 포스트맨에서 받아오는 주소값과, scoreController를 이용하여 그안의 함수 updateScore를 사용해 점수를 수정한다.

router.post('/:si_idx', scoreController.createScore); // 라우터를 이용해 포스트맨에서 받아오는 주소값과, scoreController를 이용하여 그안의 함수 createScore 사용해 점수를 등록한다.

router.delete('/:si_idx',scoreController.deleteScore); // 라우터를 이용해 포스트맨에서 받아오는 주소값과, scoreController를 이용하여 그안의 함수 deleteScore 사용해 점수를 등록한다.

export default router;