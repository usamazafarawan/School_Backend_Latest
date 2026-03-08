import express from 'express';
const router = express.Router();
import * as controller from './academy.controller';


router.get('/getSchoolAcademyStudents', controller.getSchoolAcademyStudents);
router.post('/create', controller.createAcademyStudentAdmissionRecord);
router.put('/delete-student-account', controller.deleteStudentAccount);








export = router

